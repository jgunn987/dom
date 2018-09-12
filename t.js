var assert = require('assert');
var dom = require('./index');

function root(c) {
  return dom('div', { id: 'tree', name: 'gone', style: { 
    width: '100%', float: 'left'
  } }, [
    dom('textarea', {}, [dom('some text')]),
    dom('a', { href: '#', style: { display: 'block' } }, [dom('hello world1')]),
    dom('a', { href: '#', style: { display: 'block' } }, [dom('hello world2')]),
    dom('a', { href: '#', style: { display: 'block' } }, [dom('hello world3')]),
    dom('a', { href: '#', style: { display: 'block' } }, [dom('hello world4')]),
    dom('a', { href: '#', style: { display: 'block' } }, [dom('hello world5')]),
    dom('a', { href: '#', style: { display: 'block' } }, [dom('hello world6')])
  ], { 
    click: function (e) {
      console.log(9);
    },
    mouseover: function (e) {
      console.log(8);
    }
  });
}

function root2(c) {
  return dom('div', { id: 'tree2', 'class': 'test', style: { 
    width: '200%', color: 'red' 
  } }, [
    dom('a', { href: '#', style: { display: 'block' } }, [dom('goodbye world1')]),
    dom('a', { href: '#', style: { display: 'block' } }, [dom('goodbye world2')]),
    dom('a', { href: '#', style: { display: 'block' } }, [dom('goodbye world3')]),
    dom('textarea', {}, [dom('some texting')])
  ], { 
    click: function (e) {
      console.log(9);
    },
    mouseout: function (e) {
      console.log(7);
    }  
  });
}

before(function() {
  dom.el('t');
});

describe('dom', function () {
  it('returns a vdom node for an element', function () {
    var tree = root();
    assert.ok(tree);
    assert.ok(tree.tag === 'div');
    assert.ok(tree.attributes.id === 'tree');
    assert.ok(tree.children.length === 7);
    assert.ok(typeof tree.events.click === 'function');
  });
  it('returns a vdom node for a textNode', function () {
    assert.ok(dom('text') === 'text');
  });
});

describe('dom.render', function () {
  it('renders a vnode tree', function () {
    dom.root(root);
    dom.render();
  });
  it('updates/patches a dom tree', function () {
    dom.root(root2);
    dom.render();
  });
});
