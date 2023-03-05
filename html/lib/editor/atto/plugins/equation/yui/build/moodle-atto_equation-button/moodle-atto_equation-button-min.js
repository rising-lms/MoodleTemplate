YUI.add("moodle-atto_equation-button",function(a,t){var n="atto_equation",o={EQUATION_TEXT:"atto_equation_equation",EQUATION_PREVIEW:"atto_equation_preview",SUBMIT:"atto_equation_submit",LIBRARY:"atto_equation_library",LIBRARY_GROUPS:"atto_equation_groups",LIBRARY_GROUP_PREFIX:"atto_equation_group"},s={LIBRARY:"."+o.LIBRARY,LIBRARY_GROUP:"."+o.LIBRARY_GROUPS+" > div > div",EQUATION_TEXT:"."+o.EQUATION_TEXT,EQUATION_PREVIEW:"."+o.EQUATION_PREVIEW,SUBMIT:"."+o.SUBMIT,LIBRARY_BUTTON:"."+o.LIBRARY+" button"},r={START:"\\(",END:"\\)"},u='<form class="atto_form">{{{library}}}<label for="{{elementid}}_{{CSS.EQUATION_TEXT}}">{{{get_string "editequation" component texdocsurl}}}</label><textarea class="fullwidth text-ltr {{CSS.EQUATION_TEXT}}" id="{{elementid}}_{{CSS.EQUATION_TEXT}}" rows="8"></textarea><br/><label for="{{elementid}}_{{CSS.EQUATION_PREVIEW}}">{{get_string "preview" component}}</label><div describedby="{{elementid}}_cursorinfo" class="border rounded bg-light p-1 fullwidth {{CSS.EQUATION_PREVIEW}}" id="{{elementid}}_{{CSS.EQUATION_PREVIEW}}"></div><div id="{{elementid}}_cursorinfo">{{get_string "cursorinfo" component}}</div><div class="mdl-align"><br/><button class="btn btn-secondary {{CSS.SUBMIT}}">{{get_string "saveequation" component}}</button></div></form>',l='<div class="{{CSS.LIBRARY}}"><ul class="root nav nav-tabs mb-1" role="tablist">{{#each library}}<li  class="nav-item"><a class="nav-link{{#active}} active{{/active}}" {{#active}}aria-selected="true"{{/active}}{{^active}}aria-selected="false" tabindex="-1"{{/active}} href="#{{../elementid}}_{{../CSS.LIBRARY_GROUP_PREFIX}}_{{@key}}"  data-target="#{{../elementidescaped}}_{{../CSS.LIBRARY_GROUP_PREFIX}}_{{@key}}" role="tab" data-toggle="tab">{{get_string groupname ../component}}</a></li>{{/each}}</ul><div class="tab-content mb-1 {{CSS.LIBRARY_GROUPS}}">{{#each library}}<div data-medium-type="{{CSS.LINK}}" class="tab-pane{{#active}} active{{/active}}" id="{{../elementid}}_{{../CSS.LIBRARY_GROUP_PREFIX}}_{{@key}}"><div role="toolbar">{{#split "\n" elements}}<button class="btn btn-secondary" tabindex="-1" data-tex="{{this}}"aria-label="{{this}}" title="{{this}}">{{../../DELIMITERS.START}}{{this}}{{../../DELIMITERS.END}}</button>{{/split}}</div></div>{{/each}}</div></div>';a.namespace("M.atto_equation").Button=a.Base.create("button",a.M.editor_atto.EditorPlugin,[],{_currentSelection:null,_lastCursorPos:0,_content:null,_sourceEquation:null,_groupFocus:null,_equationPatterns:[/\$\$([\S\s]+?)\$\$/,/\\\(([\S\s]+?)\\\)/,/\\\[([\S\s]+?)\\\]/,/\[tex\]([\S\s]+?)\[\/tex\]/],initializer:function(){this._groupFocus={},this.get("texfilteractive")&&(this.addButton({icon:"e/math",callback:this._displayDialogue}),this.get("host").on("atto:selectionchanged",function(){this._resolveEquation()?this.highlightButtons():this.unHighlightButtons()},this),this.editor.all("tex").each(function(t){var e=a.Node.create("<span>"+r.START+" "+t.get("text")+" "+r.END+"</span>");t.replace(e)}))},_displayDialogue:function(){var t,e,i;this._currentSelection=this.get("host").getSelection(),!1!==this._currentSelection&&(t=this._resolveEquation(),e=this.getDialogue({headerContent:M.util.get_string("pluginname",n),focusAfterHide:!0,width:600,focusOnShowSelector:s.LIBRARY_BUTTON}),i=this._getDialogueContent(),e.set("bodyContent",i),e.show(),require(["core/event"],function(t){t.notifyFilterContentUpdated(e.get("boundingBox").getDOMNode())}),t&&i.one(s.EQUATION_TEXT).set("text",t),this._updatePreview(!1))},_resolveEquation:function(){var u,t=this.get("host").getSelectionParentNode(),l=this.get("host").getSelection(),c=!1;return!!this.get("host").isActive()&&!!t&&!(!l||0===l.length)&&(this.sourceEquation=null,l=l[0],u=a.one(t).get("text"),a.Array.find(this._equationPatterns,function(r){var t=u.match(new RegExp(r.source,"g"));if(t&&t.length)return a.Array.find(t,function(t){for(var e,i,n,o,a,s=0;-1!==u.indexOf(t,s);){if(i=(e=u.indexOf(t,s))+t.length,o=l.startOffset>=e&&l.startOffset<i,a=l.endOffset<=i&&l.endOffset>e,o&&a&&(n=t.match(r))&&n.length)return a=(o=u.indexOf(n[1],e))+n[1].length,c=n[1],this.sourceEquation={startOuterPosition:e,endOuterPosition:i,outerMatch:t,startInnerPosition:o,endInnerPosition:a,innerMatch:n},!0;s=i}},this)},this),c=!1!==c?c.trim():c)},_setEquation:function(t){var e,i,n=this.get("host");t.preventDefault(),this.getDialogue({focusAfterHide:null}).hide(),""!==(t=t.currentTarget.ancestor(".atto_form").one("textarea").get("value"))&&(n.setSelection(this._currentSelection),this.sourceEquation?(t=" "+t+" ",i=(i=(e=a.one(n.getSelectionParentNode())).get("text")).slice(0,this.sourceEquation.startInnerPosition)+t+i.slice(this.sourceEquation.endInnerPosition),e.set("text",i)):n.insertContentAtFocusPoint(t=r.START+" "+t+" "+r.END),this.markUpdated())},_throttle:function(i,n){var o=null;return function(){var t=this,e=arguments;clearTimeout(o),o=setTimeout(function(){i.apply(t,e)},n)}},_updatePreview:function(t){var e,i=this._content.one(s.EQUATION_TEXT),n=i.get("value"),o=i.get("selectionStart");for(t&&t.preventDefault(),o=o||0;"\\"===n.charAt(o)&&0<=o;)--o;if(e=/[a-zA-Z\{]/,0!==o&&"{"!=n.charAt(o-1))for(;e.test(n.charAt(o))&&o<n.length&&e.test(n.charAt(o-1));)o+=1;this._lastCursorPos=o,n=n.substring(0,o)+"\\Downarrow "+n.substring(o),n=r.START+" "+n+" "+r.END,i=M.cfg.wwwroot+"/lib/editor/atto/plugins/equation/ajax.php",t={sesskey:M.cfg.sesskey,contextid:this.get("contextid"),action:"filtertext",text:n},a.io(i,{context:this,data:t,timeout:500,on:{complete:this._loadPreview}})},_loadPreview:function(t,e){var i=this._content.one(s.EQUATION_PREVIEW);200===e.status&&(i.setHTML(e.responseText),require(["core/event"],function(t){t.notifyFilterContentUpdated(i.getDOMNode())}))},_getDialogueContent:function(){var t=this._getLibraryContent(),e=this._throttle(this._updatePreview,500),i=a.Handlebars.compile(u);return this._content=a.Node.create(i({elementid:this.get("host").get("elementid"),component:n,library:t,texdocsurl:this.get("texdocsurl"),CSS:o})),
this._content.all(s.LIBRARY_GROUP).each(function(t){this._setGroupTabFocus(t,t.one("button")),t.all("button a").setAttribute("tabindex","-1")},this),this._content.delegate("key",this._groupNavigation,"down:37,39",s.LIBRARY_BUTTON,this),this._content.one(s.SUBMIT).on("click",this._setEquation,this),this._content.one(s.EQUATION_TEXT).on("valuechange",e,this),this._content.one(s.EQUATION_TEXT).on("mouseup",e,this),this._content.one(s.EQUATION_TEXT).on("keyup",e,this),this._content.delegate("click",this._selectLibraryItem,s.LIBRARY_BUTTON,this),this._content},_groupNavigation:function(t){t.preventDefault();var e=t.currentTarget,i=e.get("parentNode"),n=i.all("button"),t=37!==t.keyCode?1:-1,e=n.indexOf(e);e<0&&(e=0),(e+=t)<0?e=n.size()-1:e>=n.size()&&(e=0),t=n.item(e),this._setGroupTabFocus(i,t),t.focus()},_setGroupTabFocus:function(t,e){var i=t.generateID();"undefined"!=typeof this._groupFocus[i]&&this._groupFocus[i].setAttribute("tabindex","-1"),(this._groupFocus[i]=e).setAttribute("tabindex",0),t.setAttribute("aria-activedescendant",e.generateID())},_selectLibraryItem:function(t){var e,i,n=t.currentTarget.getAttribute("data-tex");t.preventDefault(),this._setGroupTabFocus(t.currentTarget.get("parentNode"),t.currentTarget)," "!==(i=(e=(t=t.currentTarget.ancestor(".atto_form").one("textarea")).get("value")).substring(0,this._lastCursorPos)).charAt(i.length-1)&&(i+=" "),n=(i+=n).length," "!==e.charAt(this._lastCursorPos)&&(i+=" "),i+=e.substring(this._lastCursorPos,e.length),t.set("value",i),t.focus(),"number"==typeof(e=t.getDOMNode()).selectionStart?e.selectionStart=e.selectionEnd=n:"undefined"!=typeof e.createTextRange&&((i=e.createTextRange()).moveToPoint(n),i.select()),this._updatePreview(!1)},_getLibraryContent:function(){var t=a.Handlebars.compile(l),e=this.get("library"),i="";return a.Handlebars.registerHelper("split",function(t,e,i){var n,o,a;if(void 0===t||void 0===e)return"";for(a="",n=e.trim().split(t);0<n.length;)o=n.shift().trim(),a+=i.fn(o);return a}),i=t({elementid:this.get("host").get("elementid"),elementidescaped:this._escapeQuerySelector(this.get("host").get("elementid")),component:n,library:e,CSS:o,DELIMITERS:r}),e=M.cfg.wwwroot+"/lib/editor/atto/plugins/equation/ajax.php",t={sesskey:M.cfg.sesskey,contextid:this.get("contextid"),action:"filtertext",text:i},i=200===(e=a.io(e,{sync:!0,data:t,method:"POST"})).status?e.responseText:i},_escapeQuerySelector:function(t){return t.replace(/(:|\.|\[|\]|,|=|@)/g,"\\$1")}},{ATTRS:{texfilteractive:{value:!1},contextid:{value:null},library:{value:{}},texdocsurl:{value:null}}})},"@VERSION@",{requires:["moodle-editor_atto-plugin","moodle-core-event","io","event-valuechange","tabview","array-extras"]});