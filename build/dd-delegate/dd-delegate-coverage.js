if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["dd-delegate"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "dd-delegate",
    code: []
};
_yuitest_coverage["dd-delegate"].code=["YUI.add('dd-delegate', function (Y, NAME) {","","","    /**","     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.","     * @module dd","     * @submodule dd-delegate","     */     ","    /**","     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.","     * @class Delegate","     * @extends Base","     * @constructor","     * @namespace DD","     */","","","    var Delegate = function(o) {","        Delegate.superclass.constructor.apply(this, arguments);","    },","    CONT = 'container',","    NODES = 'nodes',","    _tmpNode = Y.Node.create('<div>Temp Node</div>');","","","    Y.extend(Delegate, Y.Base, {","        /**","        * @private","        * @property _bubbleTargets","        * @description The default bubbleTarget for this object. Default: Y.DD.DDM","        */","        _bubbleTargets: Y.DD.DDM,","        /**","        * @property dd","        * @description A reference to the temporary dd instance used under the hood.","        */    ","        dd: null,","        /**","        * @property _shimState","        * @private","        * @description The state of the Y.DD.DDM._noShim property to it can be reset.","        */    ","        _shimState: null,","        /**","        * @private","        * @property _handles","        * @description Array of event handles to be destroyed","        */","        _handles: null,","        /**","        * @private","        * @method _onNodeChange","        * @description Listens to the nodeChange event and sets the dragNode on the temp dd instance.","        * @param {Event} e The Event.","        */","        _onNodeChange: function(e) {","            this.set('dragNode', e.newVal);","        },","        /**","        * @private","        * @method _afterDragEnd","        * @description Listens for the drag:end event and updates the temp dd instance.","        * @param {Event} e The Event.","        */","        _afterDragEnd: function(e) {","            Y.DD.DDM._noShim = this._shimState;","","            this.set('lastNode', this.dd.get('node'));","            this.get('lastNode').removeClass(Y.DD.DDM.CSS_PREFIX + '-dragging');","            this.dd._unprep();","            this.dd.set('node', _tmpNode);","        },","        /**","        * @private","        * @method _delMouseDown","        * @description The callback for the Y.DD.Delegate instance used","        * @param {Event} e The MouseDown Event.","        */","        _delMouseDown: function(e) {","            var tar = e.currentTarget,","                dd = this.dd,","                dNode = tar,","                config = this.get('dragConfig');","            ","            if (tar.test(this.get(NODES)) && !tar.test(this.get('invalid'))) {","                this._shimState = Y.DD.DDM._noShim;","                Y.DD.DDM._noShim = true;","                this.set('currentNode', tar);","                dd.set('node', tar);","                if (config && config.dragNode) {","                    dNode = config.dragNode;","                } else if (dd.proxy) {","                    dNode = Y.DD.DDM._proxy;","                }","                dd.set('dragNode', dNode);","                dd._prep();","                ","                dd.fire('drag:mouseDown', { ev: e });","            }","        },","        /**","        * @private","        * @method _onMouseEnter","        * @description Sets the target shim state","        * @param {Event} e The MouseEnter Event","        */","        _onMouseEnter: function(e) {","            this._shimState = Y.DD.DDM._noShim;","            Y.DD.DDM._noShim = true;","        },","        /**","        * @private","        * @method _onMouseLeave","        * @description Resets the target shim state","        * @param {Event} e The MouseLeave Event","        */","        _onMouseLeave: function(e) {","            Y.DD.DDM._noShim = this._shimState;","        },","        initializer: function(cfg) {","            this._handles = [];","            //Create a tmp DD instance under the hood.","            //var conf = Y.clone(this.get('dragConfig') || {}),","            var conf = this.get('dragConfig') || {},","                cont = this.get(CONT);","","            conf.node = _tmpNode.cloneNode(true);","            conf.bubbleTargets = this;","","            if (this.get('handles')) {","                conf.handles = this.get('handles');","            }","","            this.dd = new Y.DD.Drag(conf);","","            //On end drag, detach the listeners","            this.dd.after('drag:end', Y.bind(this._afterDragEnd, this));","            this.dd.on('dragNodeChange', Y.bind(this._onNodeChange, this));","            this.dd.after('drag:mouseup', function() {","                this._unprep();","            });","","            //Attach the delegate to the container","            this._handles.push(Y.delegate(Y.DD.Drag.START_EVENT, Y.bind(this._delMouseDown, this), cont, this.get(NODES)));","","            this._handles.push(Y.on('mouseenter', Y.bind(this._onMouseEnter, this), cont));","","            this._handles.push(Y.on('mouseleave', Y.bind(this._onMouseLeave, this), cont));","","            Y.later(50, this, this.syncTargets);","            Y.DD.DDM.regDelegate(this);","        },","        /**","        * @method syncTargets","        * @description Applies the Y.Plugin.Drop to all nodes matching the cont + nodes selector query.","        * @return {Self}","        * @chainable","        */        ","        syncTargets: function() {","            if (!Y.Plugin.Drop || this.get('destroyed')) {","                return;","            }","            var items, groups, config;","","            if (this.get('target')) {","                items = Y.one(this.get(CONT)).all(this.get(NODES));","                groups = this.dd.get('groups');","                config = this.get('dragConfig');","                ","                if (config && config.groups) {","                    groups = config.groups;","                }","","                items.each(function(i) {","                    this.createDrop(i, groups);","                }, this);","            }","            return this;","        },","        /**","        * @method createDrop","        * @description Apply the Drop plugin to this node","        * @param {Node} node The Node to apply the plugin to","        * @param {Array} groups The default groups to assign this target to.","        * @return Node","        */","        createDrop: function(node, groups) {","            var config = {","                useShim: false,","                bubbleTargets: this","            };","","            if (!node.drop) {","                node.plug(Y.Plugin.Drop, config);","            }","            node.drop.set('groups', groups);","            return node;","        },","        destructor: function() {","            if (this.dd) {","                this.dd.destroy();","            }","            if (Y.Plugin.Drop) {","                var targets = Y.one(this.get(CONT)).all(this.get(NODES));","                targets.unplug(Y.Plugin.Drop);","            }","            Y.each(this._handles, function(v) {","                v.detach();","            });","        }","    }, {","        NAME: 'delegate',","        ATTRS: {","            /**","            * @attribute container","            * @description A selector query to get the container to listen for mousedown events on. All \"nodes\" should be a child of this container.","            * @type String","            */    ","            container: {","                value: 'body'","            },","            /**","            * @attribute nodes","            * @description A selector query to get the children of the \"container\" to make draggable elements from.","            * @type String","            */        ","            nodes: {","                value: '.dd-draggable'","            },","            /**","            * @attribute invalid","            * @description A selector query to test a node to see if it's an invalid item.","            * @type String","            */        ","            invalid: {","                value: 'input, select, button, a, textarea'","            },","            /**","            * @attribute lastNode","            * @description Y.Node instance of the last item dragged.","            * @type Node","            */        ","            lastNode: {","                value: _tmpNode","            },","            /**","            * @attribute currentNode","            * @description Y.Node instance of the dd node.","            * @type Node","            */        ","            currentNode: {","                value: _tmpNode","            },","            /**","            * @attribute dragNode","            * @description Y.Node instance of the dd dragNode.","            * @type Node","            */        ","            dragNode: {","                value: _tmpNode","            },","            /**","            * @attribute over","            * @description Is the mouse currently over the container","            * @type Boolean","            */        ","            over: {","                value: false","            },","            /**","            * @attribute target","            * @description Should the items also be a drop target.","            * @type Boolean","            */        ","            target: {","                value: false","            },","            /**","            * @attribute dragConfig","            * @description The default config to be used when creating the DD instance.","            * @type Object","            */        ","            dragConfig: {","                value: null","            },","            /**","            * @attribute handles","            * @description The handles config option added to the temp DD instance.","            * @type Array","            */        ","            handles: {","                value: null","            }","        }","    });","","    Y.mix(Y.DD.DDM, {","        /**","        * @private","        * @for DDM","        * @property _delegates","        * @description Holder for all Y.DD.Delegate instances","        * @type Array","        */","        _delegates: [],","        /**","        * @for DDM","        * @method regDelegate","        * @description Register a Delegate with the DDM","        */","        regDelegate: function(del) {","            this._delegates.push(del);","        },","        /**","        * @for DDM","        * @method getDelegate","        * @description Get a delegate instance from a container node","        * @return Y.DD.Delegate","        */","        getDelegate: function(node) {","            var del = null;","            node = Y.one(node);","            Y.each(this._delegates, function(v) {","                if (node.test(v.get(CONT))) {","                    del = v;","                }","            }, this);","            return del;","        }","    });","","    Y.namespace('DD');    ","    Y.DD.Delegate = Delegate;","","","","","}, '@VERSION@', {\"requires\": [\"dd-drag\", \"dd-drop-plugin\", \"event-mouseenter\"]});"];
_yuitest_coverage["dd-delegate"].lines = {"1":0,"18":0,"19":0,"26":0,"57":0,"66":0,"68":0,"69":0,"70":0,"71":0,"80":0,"85":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"92":0,"93":0,"95":0,"96":0,"98":0,"108":0,"109":0,"118":0,"121":0,"124":0,"127":0,"128":0,"130":0,"131":0,"134":0,"137":0,"138":0,"139":0,"140":0,"144":0,"146":0,"148":0,"150":0,"151":0,"160":0,"161":0,"163":0,"165":0,"166":0,"167":0,"168":0,"170":0,"171":0,"174":0,"175":0,"178":0,"188":0,"193":0,"194":0,"196":0,"197":0,"200":0,"201":0,"203":0,"204":0,"205":0,"207":0,"208":0,"297":0,"312":0,"321":0,"322":0,"323":0,"324":0,"325":0,"328":0,"332":0,"333":0};
_yuitest_coverage["dd-delegate"].functions = {"Delegate:18":0,"_onNodeChange:56":0,"_afterDragEnd:65":0,"_delMouseDown:79":0,"_onMouseEnter:107":0,"_onMouseLeave:117":0,"(anonymous 2):139":0,"initializer:120":0,"(anonymous 3):174":0,"syncTargets:159":0,"createDrop:187":0,"(anonymous 4):207":0,"destructor:199":0,"regDelegate:311":0,"(anonymous 5):323":0,"getDelegate:320":0,"(anonymous 1):1":0};
_yuitest_coverage["dd-delegate"].coveredLines = 76;
_yuitest_coverage["dd-delegate"].coveredFunctions = 17;
_yuitest_coverline("dd-delegate", 1);
YUI.add('dd-delegate', function (Y, NAME) {


    /**
     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
     * @module dd
     * @submodule dd-delegate
     */     
    /**
     * Provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
     * @class Delegate
     * @extends Base
     * @constructor
     * @namespace DD
     */


    _yuitest_coverfunc("dd-delegate", "(anonymous 1)", 1);
_yuitest_coverline("dd-delegate", 18);
var Delegate = function(o) {
        _yuitest_coverfunc("dd-delegate", "Delegate", 18);
_yuitest_coverline("dd-delegate", 19);
Delegate.superclass.constructor.apply(this, arguments);
    },
    CONT = 'container',
    NODES = 'nodes',
    _tmpNode = Y.Node.create('<div>Temp Node</div>');


    _yuitest_coverline("dd-delegate", 26);
Y.extend(Delegate, Y.Base, {
        /**
        * @private
        * @property _bubbleTargets
        * @description The default bubbleTarget for this object. Default: Y.DD.DDM
        */
        _bubbleTargets: Y.DD.DDM,
        /**
        * @property dd
        * @description A reference to the temporary dd instance used under the hood.
        */    
        dd: null,
        /**
        * @property _shimState
        * @private
        * @description The state of the Y.DD.DDM._noShim property to it can be reset.
        */    
        _shimState: null,
        /**
        * @private
        * @property _handles
        * @description Array of event handles to be destroyed
        */
        _handles: null,
        /**
        * @private
        * @method _onNodeChange
        * @description Listens to the nodeChange event and sets the dragNode on the temp dd instance.
        * @param {Event} e The Event.
        */
        _onNodeChange: function(e) {
            _yuitest_coverfunc("dd-delegate", "_onNodeChange", 56);
_yuitest_coverline("dd-delegate", 57);
this.set('dragNode', e.newVal);
        },
        /**
        * @private
        * @method _afterDragEnd
        * @description Listens for the drag:end event and updates the temp dd instance.
        * @param {Event} e The Event.
        */
        _afterDragEnd: function(e) {
            _yuitest_coverfunc("dd-delegate", "_afterDragEnd", 65);
_yuitest_coverline("dd-delegate", 66);
Y.DD.DDM._noShim = this._shimState;

            _yuitest_coverline("dd-delegate", 68);
this.set('lastNode', this.dd.get('node'));
            _yuitest_coverline("dd-delegate", 69);
this.get('lastNode').removeClass(Y.DD.DDM.CSS_PREFIX + '-dragging');
            _yuitest_coverline("dd-delegate", 70);
this.dd._unprep();
            _yuitest_coverline("dd-delegate", 71);
this.dd.set('node', _tmpNode);
        },
        /**
        * @private
        * @method _delMouseDown
        * @description The callback for the Y.DD.Delegate instance used
        * @param {Event} e The MouseDown Event.
        */
        _delMouseDown: function(e) {
            _yuitest_coverfunc("dd-delegate", "_delMouseDown", 79);
_yuitest_coverline("dd-delegate", 80);
var tar = e.currentTarget,
                dd = this.dd,
                dNode = tar,
                config = this.get('dragConfig');
            
            _yuitest_coverline("dd-delegate", 85);
if (tar.test(this.get(NODES)) && !tar.test(this.get('invalid'))) {
                _yuitest_coverline("dd-delegate", 86);
this._shimState = Y.DD.DDM._noShim;
                _yuitest_coverline("dd-delegate", 87);
Y.DD.DDM._noShim = true;
                _yuitest_coverline("dd-delegate", 88);
this.set('currentNode', tar);
                _yuitest_coverline("dd-delegate", 89);
dd.set('node', tar);
                _yuitest_coverline("dd-delegate", 90);
if (config && config.dragNode) {
                    _yuitest_coverline("dd-delegate", 91);
dNode = config.dragNode;
                } else {_yuitest_coverline("dd-delegate", 92);
if (dd.proxy) {
                    _yuitest_coverline("dd-delegate", 93);
dNode = Y.DD.DDM._proxy;
                }}
                _yuitest_coverline("dd-delegate", 95);
dd.set('dragNode', dNode);
                _yuitest_coverline("dd-delegate", 96);
dd._prep();
                
                _yuitest_coverline("dd-delegate", 98);
dd.fire('drag:mouseDown', { ev: e });
            }
        },
        /**
        * @private
        * @method _onMouseEnter
        * @description Sets the target shim state
        * @param {Event} e The MouseEnter Event
        */
        _onMouseEnter: function(e) {
            _yuitest_coverfunc("dd-delegate", "_onMouseEnter", 107);
_yuitest_coverline("dd-delegate", 108);
this._shimState = Y.DD.DDM._noShim;
            _yuitest_coverline("dd-delegate", 109);
Y.DD.DDM._noShim = true;
        },
        /**
        * @private
        * @method _onMouseLeave
        * @description Resets the target shim state
        * @param {Event} e The MouseLeave Event
        */
        _onMouseLeave: function(e) {
            _yuitest_coverfunc("dd-delegate", "_onMouseLeave", 117);
_yuitest_coverline("dd-delegate", 118);
Y.DD.DDM._noShim = this._shimState;
        },
        initializer: function(cfg) {
            _yuitest_coverfunc("dd-delegate", "initializer", 120);
_yuitest_coverline("dd-delegate", 121);
this._handles = [];
            //Create a tmp DD instance under the hood.
            //var conf = Y.clone(this.get('dragConfig') || {}),
            _yuitest_coverline("dd-delegate", 124);
var conf = this.get('dragConfig') || {},
                cont = this.get(CONT);

            _yuitest_coverline("dd-delegate", 127);
conf.node = _tmpNode.cloneNode(true);
            _yuitest_coverline("dd-delegate", 128);
conf.bubbleTargets = this;

            _yuitest_coverline("dd-delegate", 130);
if (this.get('handles')) {
                _yuitest_coverline("dd-delegate", 131);
conf.handles = this.get('handles');
            }

            _yuitest_coverline("dd-delegate", 134);
this.dd = new Y.DD.Drag(conf);

            //On end drag, detach the listeners
            _yuitest_coverline("dd-delegate", 137);
this.dd.after('drag:end', Y.bind(this._afterDragEnd, this));
            _yuitest_coverline("dd-delegate", 138);
this.dd.on('dragNodeChange', Y.bind(this._onNodeChange, this));
            _yuitest_coverline("dd-delegate", 139);
this.dd.after('drag:mouseup', function() {
                _yuitest_coverfunc("dd-delegate", "(anonymous 2)", 139);
_yuitest_coverline("dd-delegate", 140);
this._unprep();
            });

            //Attach the delegate to the container
            _yuitest_coverline("dd-delegate", 144);
this._handles.push(Y.delegate(Y.DD.Drag.START_EVENT, Y.bind(this._delMouseDown, this), cont, this.get(NODES)));

            _yuitest_coverline("dd-delegate", 146);
this._handles.push(Y.on('mouseenter', Y.bind(this._onMouseEnter, this), cont));

            _yuitest_coverline("dd-delegate", 148);
this._handles.push(Y.on('mouseleave', Y.bind(this._onMouseLeave, this), cont));

            _yuitest_coverline("dd-delegate", 150);
Y.later(50, this, this.syncTargets);
            _yuitest_coverline("dd-delegate", 151);
Y.DD.DDM.regDelegate(this);
        },
        /**
        * @method syncTargets
        * @description Applies the Y.Plugin.Drop to all nodes matching the cont + nodes selector query.
        * @return {Self}
        * @chainable
        */        
        syncTargets: function() {
            _yuitest_coverfunc("dd-delegate", "syncTargets", 159);
_yuitest_coverline("dd-delegate", 160);
if (!Y.Plugin.Drop || this.get('destroyed')) {
                _yuitest_coverline("dd-delegate", 161);
return;
            }
            _yuitest_coverline("dd-delegate", 163);
var items, groups, config;

            _yuitest_coverline("dd-delegate", 165);
if (this.get('target')) {
                _yuitest_coverline("dd-delegate", 166);
items = Y.one(this.get(CONT)).all(this.get(NODES));
                _yuitest_coverline("dd-delegate", 167);
groups = this.dd.get('groups');
                _yuitest_coverline("dd-delegate", 168);
config = this.get('dragConfig');
                
                _yuitest_coverline("dd-delegate", 170);
if (config && config.groups) {
                    _yuitest_coverline("dd-delegate", 171);
groups = config.groups;
                }

                _yuitest_coverline("dd-delegate", 174);
items.each(function(i) {
                    _yuitest_coverfunc("dd-delegate", "(anonymous 3)", 174);
_yuitest_coverline("dd-delegate", 175);
this.createDrop(i, groups);
                }, this);
            }
            _yuitest_coverline("dd-delegate", 178);
return this;
        },
        /**
        * @method createDrop
        * @description Apply the Drop plugin to this node
        * @param {Node} node The Node to apply the plugin to
        * @param {Array} groups The default groups to assign this target to.
        * @return Node
        */
        createDrop: function(node, groups) {
            _yuitest_coverfunc("dd-delegate", "createDrop", 187);
_yuitest_coverline("dd-delegate", 188);
var config = {
                useShim: false,
                bubbleTargets: this
            };

            _yuitest_coverline("dd-delegate", 193);
if (!node.drop) {
                _yuitest_coverline("dd-delegate", 194);
node.plug(Y.Plugin.Drop, config);
            }
            _yuitest_coverline("dd-delegate", 196);
node.drop.set('groups', groups);
            _yuitest_coverline("dd-delegate", 197);
return node;
        },
        destructor: function() {
            _yuitest_coverfunc("dd-delegate", "destructor", 199);
_yuitest_coverline("dd-delegate", 200);
if (this.dd) {
                _yuitest_coverline("dd-delegate", 201);
this.dd.destroy();
            }
            _yuitest_coverline("dd-delegate", 203);
if (Y.Plugin.Drop) {
                _yuitest_coverline("dd-delegate", 204);
var targets = Y.one(this.get(CONT)).all(this.get(NODES));
                _yuitest_coverline("dd-delegate", 205);
targets.unplug(Y.Plugin.Drop);
            }
            _yuitest_coverline("dd-delegate", 207);
Y.each(this._handles, function(v) {
                _yuitest_coverfunc("dd-delegate", "(anonymous 4)", 207);
_yuitest_coverline("dd-delegate", 208);
v.detach();
            });
        }
    }, {
        NAME: 'delegate',
        ATTRS: {
            /**
            * @attribute container
            * @description A selector query to get the container to listen for mousedown events on. All "nodes" should be a child of this container.
            * @type String
            */    
            container: {
                value: 'body'
            },
            /**
            * @attribute nodes
            * @description A selector query to get the children of the "container" to make draggable elements from.
            * @type String
            */        
            nodes: {
                value: '.dd-draggable'
            },
            /**
            * @attribute invalid
            * @description A selector query to test a node to see if it's an invalid item.
            * @type String
            */        
            invalid: {
                value: 'input, select, button, a, textarea'
            },
            /**
            * @attribute lastNode
            * @description Y.Node instance of the last item dragged.
            * @type Node
            */        
            lastNode: {
                value: _tmpNode
            },
            /**
            * @attribute currentNode
            * @description Y.Node instance of the dd node.
            * @type Node
            */        
            currentNode: {
                value: _tmpNode
            },
            /**
            * @attribute dragNode
            * @description Y.Node instance of the dd dragNode.
            * @type Node
            */        
            dragNode: {
                value: _tmpNode
            },
            /**
            * @attribute over
            * @description Is the mouse currently over the container
            * @type Boolean
            */        
            over: {
                value: false
            },
            /**
            * @attribute target
            * @description Should the items also be a drop target.
            * @type Boolean
            */        
            target: {
                value: false
            },
            /**
            * @attribute dragConfig
            * @description The default config to be used when creating the DD instance.
            * @type Object
            */        
            dragConfig: {
                value: null
            },
            /**
            * @attribute handles
            * @description The handles config option added to the temp DD instance.
            * @type Array
            */        
            handles: {
                value: null
            }
        }
    });

    _yuitest_coverline("dd-delegate", 297);
Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @for DDM
        * @property _delegates
        * @description Holder for all Y.DD.Delegate instances
        * @type Array
        */
        _delegates: [],
        /**
        * @for DDM
        * @method regDelegate
        * @description Register a Delegate with the DDM
        */
        regDelegate: function(del) {
            _yuitest_coverfunc("dd-delegate", "regDelegate", 311);
_yuitest_coverline("dd-delegate", 312);
this._delegates.push(del);
        },
        /**
        * @for DDM
        * @method getDelegate
        * @description Get a delegate instance from a container node
        * @return Y.DD.Delegate
        */
        getDelegate: function(node) {
            _yuitest_coverfunc("dd-delegate", "getDelegate", 320);
_yuitest_coverline("dd-delegate", 321);
var del = null;
            _yuitest_coverline("dd-delegate", 322);
node = Y.one(node);
            _yuitest_coverline("dd-delegate", 323);
Y.each(this._delegates, function(v) {
                _yuitest_coverfunc("dd-delegate", "(anonymous 5)", 323);
_yuitest_coverline("dd-delegate", 324);
if (node.test(v.get(CONT))) {
                    _yuitest_coverline("dd-delegate", 325);
del = v;
                }
            }, this);
            _yuitest_coverline("dd-delegate", 328);
return del;
        }
    });

    _yuitest_coverline("dd-delegate", 332);
Y.namespace('DD');    
    _yuitest_coverline("dd-delegate", 333);
Y.DD.Delegate = Delegate;




}, '@VERSION@', {"requires": ["dd-drag", "dd-drop-plugin", "event-mouseenter"]});
