var _ = require('lodash');

function setAttributes(e, attributes) {
  if(!attributes) return e;
  for(var k in attributes)
    if ([
      'multiple', 
      'selected', 
      'checked', 
      'disabled'
    ].indexOf(k) !== -1 && !attributes[k]) 
      continue;
    else if (k === 'style')
      for(var j in attributes[k])
        e.style[j] = attributes[k][j]; 
    else e.setAttribute(k, attributes[k]);
  return e;
}

function appendChildren(e, children) {
  if (!children) return e;
  for(var i=0, l=children.length; i < l; ++i)
    if(!children[i]) continue;
    else e.appendChild(createElement(children[i]));
  return e;
}

function bindEvents(e, events) {
  if(!events) return e;
  for(var k in events)
    e['on' + k] = function (e) {
      events[k](e || window.event);
    };
  return e;
}

function createElement(node) {
  if(typeof node === 'string')
    return document.createTextNode(node);
  return bindEvents(
    appendChildren(
      setAttributes(
        document.createElement(node.tag), 
        node.attributes), 
      node.children), 
    node.events);
}

function diffElement(parentNode, el, lhs, rhs) {
  if(!lhs && rhs) {//new
    return parentNode.appendChild(createElement(rhs));
  }
  if(lhs && !rhs) {//delete
    return parentNode.removeChild(el);
  }
  if((typeof lhs === 'string' && typeof rhs !== 'string') ||
     (typeof lhs !== 'string' && typeof rhs === 'string')) {
    return parentNode.replaceChild(createElement(rhs), el);
  }
  if(typeof rhs === 'string' && typeof lhs === 'string' && lhs !== rhs) {
    return parentNode.replaceChild(createElement(rhs), el);
  }
  if(lhs.tag !== rhs.tag) {//new
    return parentNode.replaceChild(createElement(rhs), el);
  }

  diffAttributes(parentNode, el, lhs.attributes || {}, rhs.attributes || {});
  diffChildren(parentNode, el, lhs.children || [], rhs.children || []);
  diffEvents(parentNode, el, lhs.events, rhs.events);
  return el; 
}

function diffAttributes(parentNode, el, lhs, rhs) {
  for(var k in lhs) {
    if(!(k in rhs)) {//delete
      el.removeAttribute(k);
    } else if(lhs[k] !== rhs[k]) {//edit
      if (k === 'style') {
        diffStyle(parentNode, el, lhs.style || {}, rhs.style || {});
      } else {
        el.setAttribute(k, rhs[k]);
      }
    }
  }
  for(var k in rhs) {
    if(!(k in lhs)) {//new
      if(k === 'style') {
        diffStyle(parentNode, el, lhs.style || {}, rhs.style || {});
      } else {
        el.setAttribute(k, rhs[k]);
      }
    }
  }
}

function diffStyle(parentNode, el, lhs, rhs) {
  for(var k in lhs) {
    if(!(k in rhs)) {//delete
      el.style[k] = undefined;
    } else if(lhs[k] !== rhs[k]) {//edit
      el.style[k] = rhs[k];
    }
  }
  for(var k in rhs) {
    if(!(k in lhs)) {//new
      el.style[k] = rhs[k];
    }
  }
}

function diffChildren(parentNode, el, lhs, rhs) {
  for(var i=0, l=lhs.length; i < l; ++i) {
    diffElement(el, el.childNodes[i], lhs[i], rhs[i]);
  }
  for(var i=lhs.length, l=rhs.length; i < l;++i) {
    diffElement(el, el.childNodes[i], lhs[i], rhs[i]);
  }
}

function diffEvents(parentNode, el, lhs, rhs) {
  for(var k in lhs) {
    if(!(k in rhs)) {//delete
      el['on' + k] = undefined;
    } else {//edit
      el['on' + k] = function (e) {
        rhs[k](e || window.event);
      };
    }
  }
  for(var k in rhs) {
    if(!(k in lhs)) {//new
      el['on' + k] = function (e) {
        rhs[k](e || window.event);
      };
    }
  }
}

var state = null;
var rootEl = null;
var rootView = null;

function root(fn) { 
  return rootView = fn; 
}

function el(e) { 
  return rootEl = document.getElementById(e);
}

function render(c) {
  return diffElement(rootEl, rootEl.childNodes[0], state, state = rootView(c));
}

function element(name, attributes, children, events) {
  if(!attributes && !children && !events) return name;
  return {
    tag: name,
    attributes: attributes,
    children: _.filter(children, function(v) { return v; }),
    events: events
  };
}

module.exports = element;
module.exports.root = root;
module.exports.el = el;
module.exports.render = render;
