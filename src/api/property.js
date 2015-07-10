import assignSafe from '../util/assign-safe';
import dashCase from '../util/dash-case';
import data from '../util/data';
import maybeThis from '../util/maybe-this';

var getDescriptor = Object.getOwnPropertyDescriptor;

// TODO: Lean out option normalisation.
function property (name, prop, existingProp = {}) {
  var internalGetter, internalSetter, internalValue, isBoolean;

  if (typeof prop === 'object') {
    prop = assignSafe({}, prop);
  } else {
    prop = { type: prop };
  }

  if (prop.attr === true) {
    prop.attr = dashCase(name);
  }

  if (typeof prop.type !== 'function') {
    prop.type = val => val;
  }

  if (prop.init !== undefined && typeof prop.init !== 'function') {
    let value = prop.init;
    prop.init = () => value;
  }

  internalGetter = prop.get;
  internalSetter = prop.set;
  isBoolean = prop.type && prop.type === Boolean;

  prop.get = function () {
    if (internalGetter) {
      return internalGetter.apply(this);
    }

    if (existingProp.get) {
      return existingProp.get.call(this);
    }

    return internalValue;
  };

  prop.set = function (value) {
    var info = data(this);

    // If the property is being updated and it is a boolean we must just check
    // if the attribute exists because "" is true for a boolean attribute.
    if (info.updatingProperty && isBoolean) {
      value = this.hasAttribute(prop.attr);
    }

    // We report both new and old values;
    var newValue = prop.type(value);
    var oldValue = this[name];

    // Regardless of any options, we store the value internally.
    internalValue = newValue;

    // We check first to see if we're already updating the property from
    // the attribute. If we are, then there's no need to update the attribute
    // especially because it would invoke an infinite loop.
    if (prop.attr && !info.updatingProperty) {
      info.updatingAttribute = true;

      if (isBoolean && internalValue) {
        this.setAttribute(prop.attr, '');
      } else if (internalValue == null || isBoolean && !internalValue) {
        this.removeAttribute(prop.attr, '');
      } else {
        this.setAttribute(prop.attr, internalValue);
      }

      info.updatingAttribute = false;
    }

    // A setter is responsible for setting its own value. We still store the
    // value internally because the default getter may still be used to return
    // that value. Even if it's not, we use it to reference the old value which
    // is useful information for the setter.
    if (internalSetter) {
      internalSetter.call(this, newValue, oldValue);
    }

    // Ensure that if there was an existing setter that we've overridden that
    // it get's notified of the new value.
    if (existingProp.set) {
      existingProp.set.call(this, newValue, oldValue);
    }
  };

  return prop;
}

function defineProperty (elem, name, prop) {
  var existingProp = getDescriptor(elem, name);

  // We don't need to scope the data to the component ID be cause if multiple
  // bindings on the same component define the same attribute, then they'd
  // conflict anyways.
  var info = data(elem);

  if (!info.attributeToPropertyMap) {
    info.attributeToPropertyMap = {};
  }

  prop = property(name, prop, existingProp);
  Object.defineProperty(elem, name, prop);

  // TODO: What happens if the setter does something with a descendant that
  // may not exist yet?
  //
  // Initialise the value if a initial value was provided. Attributes that exist
  // on the element should trump any default values that are provided.
  if (prop.init && (!prop.attr || !elem.hasAttribute(prop.attr))) {
    elem[name] = prop.init.call(elem);
  }

  // This ensures that the corresponding attribute will know to update this
  // property when it is set.
  if (prop.attr) {
    info.attributeToPropertyMap[prop.attr] = name;
  }
}

function defineProperties (elem, props) {
  Object.keys(props).forEach(function (name) {
    defineProperty(elem, name, props[name]);
  });
}

export default maybeThis(function (elem, props = {}, prop = {}) {
  if (typeof props === 'string') {
    defineProperty(elem, props, prop);
  } else {
    defineProperties(elem, props);
  }
});
