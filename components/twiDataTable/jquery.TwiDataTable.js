/**
 * jQuery twiDataTable plugin
 * @Author：feitianxinhong http://feitianxinhong.com 
 * @Version：1.3.7
 * @CreateDate：2014-10-25
 * @LastEditDate:2020-04-05
 * @Example: Visit http://feitianxinhong.com 
 * @Copyright ©2010-2020 Tyingsoft 杭州踏影科技有限公司 之 Twilight/Twifly开源系列. 转载请保留本行注明.   
 * @License：Twi Framework of Tyingsoft is licensed under the MIT license.  
 * @Description：基于jquery+Bootstrap的表格控件
 * @Require: bootstrap-3.2.0样式或以上 
 *
 * ------------------------------------------------------------------
 * 编号    版本号      作者              修改日期        修改内容
 * ------------------------------------------------------------------
 *  1      1.0.0       feitianxinhong    2014-10-17     创建文件
 *  2      2.0.0(分支) feitianxinhong    2014-10-17    【暂时作废停滞】 checkbox使用iCheck  
 *  3      1.1.0       feitianxinhong    2014-10-24     增加了选择框来支持多选、增加了部分方法
 *  4      1.1.1       feitianxinhong    2014-10-25     增加了高度配置，滚动效果
 *  5      1.2.0       feitianxinhong    2014-10-27     增加了可配置tbar,支持皮肤skin配置
 *  6      1.2.1       feitianxinhong    2015-01-04     增加支持renderer、format，支持单行移位操作：至顶部（rowDownToFirst）、上移（rowUp）、下移（rowDown）、至底部（rowDownToLast）
 *  7      1.2.2       feitianxinhong    2015-01-06     增加列配置事件：cellclick，移位操作支持多选rowDownToFirst、rowUp、rowDown、rowDownToLast。editData方法修正
 *  8      1.2.3       feitianxinhong    2015-01-08     增加showMoveRowGroup配置来支持内置tbar显示 
 *  9      1.2.4       feitianxinhong    2015-01-12     增加bbar配置，toolbar/bbar 增加配置项类型：btnDdm、html,增加Position：first模式。btnGroup/btnDdm的children项支持字符串项及父子优先级配置。
 *  10     1.2.5       feitianxinhong    2015-01-19     增加了版本号VERSION。列配置支持hidden,用于显示和隐藏列。 支持分页Paging。支持排序sorting【初稿未完】。 
 *  11     1.2.6       feitianxinhong    2015-02-28     增加autoLoad配置、增加reload函数
 *  12     1.2.7       feitianxinhong    2015-03-05     增加支持修改单元格内容
 *  13     1.2.8       feitianxinhong    2015-03-06     增加通用化条件查询配置
 *                     feitianxinhong    2015-03-09     修正高度设置，不用再额外去处理标题、操作工具栏的高度影响问题。增加resize、setWidth、setHeight方法
 *  14     1.3.0       feitianxinhong    2015-03-10     支持TreeGrid结构展示方式;修正编辑列未使用renderer、format格式问题；修正分页reload问题；
 *  15     1.3.1       feitianxinhong    2015-03-13     render函数参数增加rowdata
 *                     feitianxinhong    2015-03-20     增加了版本发布时间:PUBLICTIME,用于同版本下区分。修正查询条件下拉向上弹出选择。修正bbar、pbar同时存在的高度计算问题。
 *  16     1.3.2       feitianxinhong    2015-04-09     解决MainFrame的panel存在margin-bottom:20px的问题。 将getTokenHeight中使用的height()改成outerHeight()来修正所有高度不对的问题。
 *  17     1.3.3       feitianxinhong    2015-04-12     多选的时候增加点击即选中或取消选中。glyphIcon obar增加图标和文字间距。 修正分页默认条数问题。
 *  18     1.3.4       feitianxinhong    2016-01-28     完善1.2.5排序功能，支持列排序功能。
 *  19     1.3.5       feitianxinhong    2017-08-07     1.修正TreeGrid父节点未查出的时候，子节点数据未显示。2.Grid重新加载数据后，可设置为显示当前页（page.isReloadPage）
 *  20     1.3.6       feitianxinhong    2017-09-11     1.增加内置的format格式，1)、加粗：strong；2)、自定义颜色：color#rgb,如红色为：color#ff0000;3)、自定义颜色加粗显示：scolor#rgb;
 *  21     1.3.7       feitianxinhong    2020-04-05     无，直接融合到1.4.0版本中
 *  22     1.4.0       feitianxinhong    2020-06-28
 * ------------------------------------------------------------------
 */


(function ($) {
    var global = this;
    if (typeof Twi === 'undefined') {
        global.Twi = {
            emptyFn: function () { }
        };
    }
    Twi.global = global;

    /**
     * config配置说明：
     *
     * idField:      '主键或唯一字段',
     * title:        '标题',
     * skin:         '表格皮肤：'default,primary,success,info,warning,danger',
     * columns:[{
     *    text:      '表头标题【必填】',
     *    fieldName: '对应字段【必填】',
     *    dataType:  '数据类型，不填为字符串',
     *    width:     '列宽，不填则为自动',
     *    renderer:  '显示格式转换函数'【1.2.1+】,
     *    format:    '预定义数据格式，即使用内置的renderer函数,如：bool使用“√ ×”表示' 【1.2.1+】,
     *    cellclick: '单元格点击事件【1.2.2+】，参数args： 
     *                   1、tableSelf: Twi.DataTable对象，
     *                   2、rowData: 行数据,
     *                   3、rowIndex: 行索引,
     *                   4、colData: 列数据,
     *                   5、configColIndex: 数据列在配置columns的索引,
     *                   6、colFieldName: 列fieldName'
     *    hidden：   '显示和隐藏列,default:false 【1.2.5+】',
     *    editable： '是否可编辑 default：false  【1.2.6+】',
     *    orderFields: '排序字段，未配置则直接取该列对应的fieldName的值，如果设置为false，则表示该列不可排序' 【1.3.4+】 
     *  }],
     * width:        'grid宽度，数字',
     * height:       'grid高度，数字',
     * renderTo:     '表格呈现的位置，默认为body，如果为id，则格式为：#id',
     * rownumberer:  '配置是否显示行号列，默认显示，如果为false时，不显示，可配置宽度width,默认为20px',
     * striped:      '是否隔行变色，default：true' , 
     * multiSelect:  '是否支持多选，default：false 【多选时，会自动显示checkbox列】',
     * checkBoxCol:  '配置是否显示选择框列,default：false，可配置宽度，默认为20px.',
     * toolbar:[{      
     *    xtype:''   '工具栏项类型:button、html' 
     *    
     * }],
     * quickQuery:{
     *     dock:      'tbar、bbar default：tbar'
     *     items:[{   '快速查询模式配置【1.2.8+】'
     *        text:        '条件名',
     *        fieldName:   '条件字段', 
     *        id:          '可选的id'，
     *        dataType:    '详见ComplexModel的dataType。 default：16'  
     *                      DataType.Date=5      DataType.DateTime = 6 
     *                      DataType.Int32 = 11  DataType.String = 16    
     *                      DataType.Time = 17  
     *        children:[{  '配置children表示使用group模式，可从多个条件中选择一个进行查询,dateType为统一父级的类型'
     *            text: '',  
     *            fieldName,''
     *        }]
     *     }],
     *     handler: 查询事件，args参数说明：
     *                   data: 参数键值对象，格式如{FCode:'feitianxinhong',FName:'飞天心宏'}
     *                   condition:  条件数组，自动组合成ComplexModel格式
     * },
     * bbar:[{
     *    xtype:''   '底部工具栏【1.2.4+】'
     * }]
     * showMoveRowGroup： '是否在底部工具栏中显示移动行按钮组，default：false'【1.2.3+】, 
     * sortable:     '列是否可排序 default:true 【1.2.5+】',
     * sortFn:       '排序函数，args参数说明：orderFields,排序字段（含ASC、DESC）【1.3.4+】',
     * paging:       '分页配置。【1.2.5+】 true or false default：false'，paging 还可配置为对象：
     * {
     *     model:      '分页显示方式，如：'classic、phone、bootstrap、auto'： auto使用响应式处理方式， 如果分页，默认模式：auto
     *     pageSize:   '每页显示条数 默认为25',
     *     startIndex: '跳过的系列中指定的条数 默认为0'
     *     isReloadPage: 'true or false. 重新加载数据是否重置页码，默认：true,重置为第一页。false：仍显示当前页【1.3.5+】' 
     * } 
     * ajax:{          '远程加载数据参数，详见Twi.Ajax的参数' 【1.2.5+】
     * 
     * }
     * autoLoad:       '是否自动加载远程数据，default:false'【1.2.6+】
     * treeGrid:{      'treeGrid配置【1.3.0+】'   或直接配置true or false
     *    idField：       'default:FID,与config.idField的配置无直接关系'
     *    parentIDField:  '父节点ID，default：FPARENTID', 
     *    rootParentIDValue: '根节点ID值，默认为空'
     *    model:          '显示模式：文件夹模式（folder）、加号模式（plus），default：folder  '
     * }
     * 注意：配了treeGrid显示方式，请不要把第一列设置为editable，这个还有点小bugger 【2015-03-11 14:15:38】
     *
     * 事件配置说明： 
     *         1、事件名做为config配置时，需加前缀on，如事件rowclick，配置时为onrowclick
     *         2、事件名全部为小写 【Sencha Extjs 事件特殊命名规则】
     *
     * ---------------------------------------------------------------
     *
     * config中会在内容自动处理的属性（即使配置也会被重写）【私有属性，勿赋值】：
     *
     * config._showRowNumber:  '是否显示行号',
     * config._showCheckBox:   '是否显示选择框列',
     * config._showTbar:    '是否显示工具栏'
     * config._showBbar:       '是否显示底部工具栏'  【1.2.3+】   Bbar：BottomToolbar
     * config._showAsTreeGrid  '是否以TreeGrid方式显示 【1.3.0+】'
     *
     * ----------------------------------------------------------------
     *
     * 属性说明:  
     * 
     *
     * 私有变量为下划线为前缀：
     *
     * _headHtml:'',             //Table表头HTML
     * _data：[],                //数组，本地的数据存储
     * _colFormat:[],            //预定义数据格式，函数集合。可扩展至columns.format使用。【1.2.1+】
     * _handlers:[],             //事件集合
     * _idFieldValues:[]         //idField对应值集合 
     * _orderFields:''           //排序字段【1.3.4+】
     * 
     * ----------------------------------------------------------------
     * 
     * 事件说明：
     * rowclick(args)
     *     参数说明： 
     *              1、tableSelf : Twi.DataTable对象
     *              2、rowData:    行数据对象
     *              3、rowIndex：  行索引
     * 
     * ----------------------------------------------------------------
     * 方法说明：
     * getId：                获取Id
     * getData：              获取数据源数据 【1.2.1+】
     * editData：             修改选中行的数据【1.2.1+】 【1.2.2+ bugger修正】 
     * refresh：              刷新【1.2.1+】
     * getLastSelected：      获取最后选择行信息【仅限单选模式有效,多选请使用getSelections()】
     * getSelections：        获取选择的集合
     * getLastSelectedIndex： 获取最后选择行索引【仅限单选模式有效,多选请使用getSelectionsIndex()】【1.2.1+】
     * getSelectionsIndex:    获取选择的集合的索引 【1.2.1+】
     * selectAll:             选择所有行
     * unSelectAll:           取消选择所有行
     * checkedByKeyValue：    根据键值对选中行【可能会选中多行】
     * checkedById：          根据idField的值选中行【如果idField未配置无效,由于默认idField唯一，所以只会选择第一个】
     * checkedByIndex：       根据索引选中行
     * rowUp：                选择行向上移动 【1.2.1+】 【1.2.2+ 支持多选】 
     * rowDown：              选择行向下移动 【1.2.1+】 【1.2.2+ 支持多选】
     * rowUpToFirst：         选择行向上移动至最顶部（第一个元素的位置）   【1.2.1+】【1.2.2+ 支持多选】
     * rowDownToLast：        选择行向上移动至最底部（最后一个元素的位置） 【1.2.1+】【1.2.2+ 支持多选】
     * addColFormat：         扩展添加预定义数据格式，列数据显示格式 columns.format【1.2.1+】
     * getColFormat：         获取预定义数据格式函数  【1.2.1+】
     * addListener/on:        添加事件
     * removeListener/un/off: 移除事件
     * fireEvent:             触发事件
     *
     *
     *
     * ----------------------------------------------------------------
     */

    /**
     * 空函数
     */
    function emptyFn() { }

    /**
     * 执行指定函数
     */
    function execFn(fn) {
        if (typeof fn == 'function') {
            return fn;
        }
        return emptyFn;
    }

    /**
     * 首字母大写
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * 随机数(返回几位随机数)
     * @len:随机数长度，default:4
     */
    function getRandom(len) {
        len = len || 4;
        return Math.floor(Math.pow(10,len) * Math.random());
    }

    /**
     * Glyphicons 字体图标
     * @iconCls: 图标样式 如：glyphicon-plus
     * @text：紧跟图标后的文本，如：新增
     */
    function glyphIcon(iconCls, text) {
        iconCls = iconCls || '';
        text = text || '';
        var html = '<span class="glyphicon ' + iconCls + '"></span>';
        html += '<span class="auto-hidden twiGlyphText">' + text + '</span>';
        return html;
    }

    /**
     * 设置图标颜色值
     * @parentId: 父节点ID，包含图标的DOM节点ID
     * @colorValue:颜色只或颜色名称，如：red、#FF0000
     */
    function setIconColor(parentId, colorValue) {
        if (typeof colorValue == 'string') {
            $('#' + parentId).children('.glyphicon').css('color', colorValue);
        }
    }

    /**
     * 生成Bootstrap按钮的HTML
     * item参数详见Obar.Item 配置
     * @item:{
     *    id:       '可选的ID',
     *    skin:     '主题，默认为default。如：success、primary等，不需要包含btn-'
     *    iconCls:  '图标'
     *    text:     '图标文本'
     * }
     * @id:         'ID,优先取item.id,再取id,如果还没有会自动生成随机'
     */
    function genBtnHtml(item,id)
    {
        //id规则
        id = item.id || id;
        id = id || twiPrefix + 'Btn' + getRandom();

        item.skin = item.skin || dftSkin;
        var skin = item.skin == dftSkin ? '' : 'btn-' + item.skin;

        var html = '<button id="' + id + '" type="button" '+genTwiFor(item.twiFor)+' class="btn btn-default ' + skin + ' btn-sm">';
        html += glyphIcon(item.iconCls, item.text);
        html += '</button>';

        return html;
    }

    /**
     * 生成Bootstrap按钮组的HTML
     * @item：     '参数详见Obar.Item 配置',
     * @id：       'groupID,优先取item.id,再取id,如果还没有会自动生成随机'
     * @genIdFn:   '生成子项ID规则函数'
     */
    function genBtnGroupHtml(item, id, genIdFn) {
        //id规则
        var btnGroupId = item.id || id;
        btnGroupId = btnGroupId || twiPrefix + 'BtnGroup' + getRandom();

        item.skin = item.skin || dftSkin;
        var skin = item.skin == dftSkin ? '' : 'btn-' + item.skin;
        var childrenIDs = [];
        var groupCls = item.cls || '';
        var html = '<div id="' + btnGroupId + '" ' + genTwiFor(item.twiFor) + ' class="btn-group  btn-group-sm ' + groupCls + '">';
        for (var i = 0; i < item.children.length; i++) {
            var childrenItem = item.children[i];
            var btnId = childrenItem.id || genIdFn();
            childrenIDs.push(btnId);            
            if (typeof childrenItem == 'string') {
                html += genBtnHtml({
                    id: btnId,
                    skin: item.skin,
                    iconCls: item.iconCls,
                    text: childrenItem
                });
            }
            else {
                if (childrenItem.xtype == 'html') {
                    html += childrenItem.html;
                }
                else if (childrenItem.xtype == 'text') {
                    html += childrenItem.text;
                }
                else if (childrenItem.xtype == 'btnDdm') {
                    var childDdmId = twiPrefix + 'BtnGroup' + getRandom();
                    html += genBtnDdmHtml(childrenItem, childDdmId, genIdFn).html;
                }
                //按钮组，未定义类型的默认都为button
                else {
                    html += genBtnHtml(childrenItem,btnId);
                }
            }
        }
        html += '</div>';

        return {
            html: html,
            childrenIDs: childrenIDs
        };

    } //end genBtnGroupHtml

    /**
     * 生成Bootstrap下拉菜单（ddm：DropDownMenu）的HTML
     * @item：     '参数详见Obar.Item 配置',
     * @id：       'groupID,优先取item.id,再取id,如果还没有会自动生成随机'
     * @genIdFn:   '生成子项ID规则函数'
     */
    function genBtnDdmHtml(item, id, genIdFn) {
        //id规则
        var btnGroupId = item.id || id;
        btnGroupId = btnGroupId || twiPrefix + 'BtnGroup' + getRandom();

        item.skin = item.skin || dftSkin;
        var skin = item.skin == dftSkin ? '' : 'btn-' + item.skin;
        var childrenIDs = [];

        var html = '';        
        var dropup = item.dropup ? 'dropup' : ''; //可能为向上弹出式菜单
        html += '<div id="' + btnGroupId + '" class="btn-group ' + dropup + ' btn-group-sm">';
        html += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' + item.text + '<span class="caret"></span></button>';
        html += '<ul class="dropdown-menu" ' + genTwiFor(item.twiFor) + ' role="menu">';
        for (var i = 0; i < item.children.length; i++) {
            var ddmItemId = genIdFn();
            childrenIDs.push(ddmItemId);
            var childrenItem = item.children[i];
            if (typeof childrenItem == 'string') {
                html += '<li id="' + ddmItemId + '"><a href="#">' + childrenItem + '</a></li>';
            }
            else {
                childrenItem.text = childrenItem.text || '';
                html += '<li id="' + ddmItemId + '"><a href="#">' + childrenItem.text + '</a></li>';
            }
        }
        html += '</ul>';
        html += '</div>';

        return {
            html: html,
            childrenIDs: childrenIDs
        };

    }//end genBtnDdmHtml

    /**
     *  生成查询条件项HTML
     *  @item: '参数详见quickQuery对应单项的配置'
     *  @id：'可选的ID，不填会自动生成',
     */
    function genQueryItemHtml(item, id,dock) {
        //id规则
        id = item.id || id;
        id = id || twiPrefix + 'QueryItm' + getRandom();
        var html = '';
        html = '<div class="input-group input-group-sm" id="' + id + '" ' + genTwiFor(twiForQueryItem) + '>';
        if (item.children instanceof Array) {
            var dropup = ''; //按钮组向上样式
            if (dock == 'bbar' || dock == 'pbar') {
                dropup = 'dropup';
            }
            html += '<div class="input-group-btn ' + dropup + '">';
            html += '<button type="button" ' + genTwiFor(twiForQueryGroupBtn) + ' class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' + item.children[0].text + '<span class="caret"></span></button>';
            html += '<ul class="dropdown-menu" role="menu" ' + genTwiFor(twiForQueryGroupUL) + '>';
            for (var i = 0; i < item.children.length; i++) {
                html += '<li><a href="#"' + genTwiFor(item.children[i].fieldName) + '>' + item.children[i].text + '</a></li>';
            }           
            html += '</ul>';
            html += '</div>';
            html += '<input type="text" class="form-control" aria-label="..." ' + genTwiFor(item.children[0].fieldName) + '>';
            
        }
        else {
            var placeHolder = "";
            if (!item.isLastItem) {
                html += '<span class="input-group-btn">';
                html += '<button class="btn btn-default" type="button">' + item.text + '</button>';
                html += '</span>';
            }
            else {
                placeHolder = item.text;
            }
            html += '<input type="text" class="form-control" placeholder="' + placeHolder + '" ' + genTwiFor(item.fieldName) + '>';
        }
        if (item.isLastItem) {
            html += '<span class="input-group-btn">';
            html += '<button class="btn btn-default" type="button"' + genTwiFor(twiForAutoQueryBtn) + '>';
            html += glyphIcon('glyphicon-search', '查询');
            html +='</button>';
            html += '</span>';
        }
        html += '</div>';
        return html;
    }//end genQueryItemHtml

    /**
     * 生成twifor标签，如：twifor="bbar"
     * @value:标签值【推荐小写】
     * @quotes:引号类型，不填默认为双引号double;单引号：single;不要引号：none
     */
    function genTwiFor(value, quotes) {
        if (!value) return ' ';
        quotes = quotes || 'double';
        if (quotes == 'single') {
            return " " + twiFor + " = '" + value + "' ";
        }
        else if (quotes == 'none') {
            // return ' ' + twiFor + ' = ' + value + ' ';
            return twiFor + '=' + value; //jquery元素查找使用
        }
        return ' ' + twiFor + ' = "' + value + '" ';
    }

    /**
     * 将数据转换为TreeGrid所需的数据格式
     * @data：对象数组，grid数据
     * @cfg: config for treeGridMapping 相关字段配置，默认如下：defaults
     * {
     *     idField: 'FID',
     *     parentIDField: 'FPARENTID',
     *     rootParentIDValue: '',
     * }
     */
    function getTreeGridData(data, cfg) {
        if (!(data instanceof Array)) return data;
        cfg.idField = cfg.idField || 'FID';
        cfg.parentIDField = cfg.parentIDField || 'FPARENTID';
        cfg.rootParentIDValue = cfg.rootParentIDValue || '';

        var newData = [];
        var _twiTgdLevel = cfg._twiTgdLevel || 0; //树结构深度，不能随意更改，其他地方需要对应
        //先把父节点全部取出来
        for (var i = 0; i < data.length; i++) {
            //加一个转换标识_twiTgdIsOver，true表示已经转换，false表示待转换  tgd:TreeGridData
            data[i]._twiTgdIsOver = data[i]._twiTgdIsOver || false;
            if ('' + data[i][cfg.parentIDField] == cfg.rootParentIDValue) {  
                data[i]._twiTgdIsOver = true;

                //递归查找子节点
                var childrenData = getTreeGridData(data, {
                    idField: cfg.idField,
                    parentIDField: cfg.parentIDField,
                    rootParentIDValue: data[i][cfg.idField],
                    _twiTgdLevel: 1 + _twiTgdLevel
                });
                //叶子节点标识_twiTgdIsLeaf，不能随意更改，其他地方需要对应
                data[i]._twiTgdIsLeaf = childrenData.length > 0 ? false : true;
                data[i]._twiChildrenCount = childrenData.length; //所有子节点个数
                data[i]._twiTgdLevel = _twiTgdLevel;
                newData.push(data[i]);
                newData = newData.concat(childrenData);
            }
        }        
        return newData;
    }

    /**
     * dft:default 默认值前缀
     */
var
    twiPrefix = 'Twi'     //Twi前缀，踏影软件工作室Tyingsoft的通用前缀
    ,twiFor  = 'twifor'   //为了避免DOM属性与其他第三方插件冲突，使用twi自定义标签。w3c规范：DOM属性全小写

    //默认事件类型
    , dftEventType = 'click'

    //默认皮肤
    ,dftSkin = 'default'
        
    //操作工具栏
    , dftObItmXtype = 'button'             //默认操作栏工具项为按钮
    , twiForTableContainer = 'tableContainer' //tableContainer
    , twiForTbar = tbarXtype = 'tbar'      // Top Toolbar   
    , twiForBbar = bbarXtype = 'bbar'      // Bottom Toolbar
    , twiForPbar = pbarXtype = 'pbar'      // Paging Toolbar

    , twiForQueryItem = 'queryItm'         //查询项标识
    , twiForQueryGroupBtn = 'qgSltBtn'     //查询条件 下拉选择按钮
    , twiForQueryGroupUL = 'qgSltUL'       //查询条件 下拉选择UL节点
    , twiForAutoQueryBtn = 'autoQueryBtn'  //查询条件自动生成的查询按钮

    , twiForThData = 'thdata'              //th 数据列

    , twiForCellEidtItem = 'cellEditItem'     //单元格编辑项          
    , twiForCellEditSave = 'cellEditSave'     // 单元格编辑保存
    , twiForCellEditCancel = 'cellEditCancel' // 单元格编辑取消，放弃修改

    , twiForTreeGridIcon = 'tgIcon'         //TreeGrid的折叠图标标识   
    , tgModelPostfix = 'IconCls'            //TreeGrid 对应模式的图标配置后缀【不可随意修改，需要修改其他对应的地方】  
    ;


    /**
     * TwiUI插件之表格控件。【Twi.DataTable】
     */
    Twi.DataTable = function (config) {    
        var me = this;

        me.VERSION = '1.3.6';  //版本号 
        me.PUBLICTIME = '2017-9-11 17:24:46'; //发布时间，辅助区分版本

        /**
         *默认配置项 
         */
        me.defaults = {
            renderTo: 'body',
            rownumberer: {
                text: '',
                width: 30
            },
            columns: [],
            striped: true,
            multiSelect: false,
            sortable: true,
            paging: false,
            autoLoad:false
        };

        /**
         * 事件
         */
        me._handlers = {};

        config = config || {};
        config = $.extend({}, me.defaults, config);

        //是否需要显示行号
        config._showRowNumber = true;
        if (typeof config.rownumberer == 'boolean') {
            if (!config.rownumberer) {
                config._showRowNumber = false;
            }
            else {
                config.rownumberer = me.defaults.rownumberer;
            }
        }

        /*选择框列*/
        config._showCheckBox = false;
        if (typeof config.checkBoxCol == 'boolean') {
            //多选时，会强制显示checkbox列
            if (config.checkBoxCol || config.multiSelect) {
                config._showCheckBox = true;
                config.checkBoxCol = {
                    width: 30
                };
            }
        }
        else if (typeof config.checkBoxCol == 'object') {
            config._showCheckBox = true;
            config.checkBoxCol.width = config.checkBoxCol.width || 30;  //列宽默认30px
        }
        else if (typeof config.checkBoxCol == 'undefined') {
            //多选时，会强制显示checkbox列
            if (config.multiSelect) {
                config._showCheckBox = true;
                config.checkBoxCol = {
                    width: 30
                };
            }
        }

        if (typeof config.quickQuery == 'object') {
            //默认查询放置在TopToolbar
            config.quickQuery.dock = config.quickQuery.dock || 'tbar';
        }

        //treeGrid默认值
        config._showAsTreeGrid = false;
        var treeGridDefaults = {
            idField: 'FID',
            parentIDField: 'FPARENTID',
            rootParentIDValue: '',
            model: 'folder',    //显示模式：文件夹模式（folder）、加号模式（plus），default：folder
            preLevelPadding:18, //每一深度的padding left 的距离
            folderIconCls: {
                open: 'glyphicon-folder-open',
                close: 'glyphicon-folder-close',
                leaf: 'glyphicon-leaf',
                onlyRoot: 'glyphicon-list-alt',//'glyphicon-grain'
                childRoot: 'glyphicon-pushpin'
            },
            plusIconCls: {
                open: 'glyphicon-minus',
                close: 'glyphicon-plus',
                leaf: 'glyphicon-heart-empty',
                onlyRoot: 'glyphicon-flash',//'glyphicon-grain'
                childRoot: 'glyphicon-pushpin'
            }
        };
        if (config.treeGrid === true) {
            config.treeGrid = treeGridDefaults;
            config._showAsTreeGrid = true;
        }
        else if (typeof config.treeGrid == 'object') {
            config.treeGrid = $.extend({},treeGridDefaults, config.treeGrid);
            config._showAsTreeGrid = true;
        }

        /*属性赋值*/
        me.config = config;
        me.frameId = "TwiDtPanel" + getRandom();
        me.id = "TwiDataTable" + getRandom();          
        me.titleId = "TwiDtTitle" + getRandom();
        me._idFieldValues = [];
        me._data = [];



       /**
        * 操作工具栏OperateToolBar    【obar、Obar】
        * ----------------------------------------
        * 常见的操作工具栏包含：        
        * 顶部工具栏：TopToolbar      【tbar、Tbar】
        * 底部工具栏：BottomToolbar   【bbar、Bbar】
        * 分页工具栏：PagingToolbar   【pbar、Pbar】
        * ----------------------------------------
        */
        me.Obar = {
            /**
             * 获取操作项ID
             * 返回如：TwiTbarItm1234、TwiBbarItm8465、TwiBbarGroupItm4521
             * @obXtype： 如tbar、bbar、pbar等
             * @itmLetter： 定义ID规则的自定义附加字母，如Itm、GroupItm等。default：Itm
             */
            getItemId: function (obXtype, itmLetter) {
                xtypeLetter = capitalize(obXtype); //首字母大写
                itmLetter = itmLetter || 'Itm';
                return twiPrefix + xtypeLetter + itmLetter + getRandom();
            } //end getItemId

            /**
             * 获取对应操作工具栏类型的panel对象，返回类型为jquery对象。
             * @obXtype： 如tbar、bbar、pbar等
             */
            , getPanelBodyObj: function (obXtype) {
                //return $('#' + me.frameId).children('.panel-body').children('div[' + twiFor + '="' + obXtype + '"]');
                return $('#' + me.frameId).children('.panel-body').children('div[' + genTwiFor(obXtype, "none") + ']');
            }//end getPanelBodyObj

            /**
             * 新增操作工具栏项  
             * ----------------------------------------
             * 参数：obarArgs
             *  {
             *     xtype:    '操作栏类型：tbar、bbar、pbar'  【必填】,
             *     item:     '操作栏项' 【必填】,
             *     ...       '其他可能需要的参数'
             *  }
             * ----------------------------------------
             *  obarArgs.item的参数配置：
             * {
             *     xtype:     '类型：button、btnGroup、html、btnDdm;default:button',
             *     text：     '显示的文字,如：新增、编辑、删除、修改...',
             *     skin:      '皮肤：'default,primary,success,info,warning,danger',
             *     cls:       '附加的class，目前只支持btnGroup',
             *     iconCls:   'bootstrap的图标，如：glyphicon-plus',
             *     iconColor: '颜色值：#dd5a43，red',
             *     eventType: '事件类型，default:click',
             *     handler:   '点击事件',
             *     position:  '位置:first、last，default:last',
             *     twiFor:    'twifor属性标识'【1.2.5+】,
             *     children:[{   //当xtype为btnGroup的时候需要配置子项
             *          //配置和父级点相同，但是不能是btnGroup。
             *          //说明：btnGroup下配置的children的xtype默认为button，配置xtype可省略
             *          dropup： 'true or false   btnDdm是否显示为向上弹出式菜单'
             *     }],
             *     html:''  //xtype=html的配置项
             * }
             *
             */
            , addItem: function (obarArgs) {
                var obar = me.Obar;
                var item = obarArgs.item;
                item.xtype = item.xtype || dftObItmXtype;

                /**
                 * 获取操作项ID
                 */
                function getItemId(itmLetter) {
                    return me.Obar.getItemId(obarArgs.xtype, itmLetter);
                }

                /**
                 *  获取对应twifor = obarArgs.xtype的panel对象，返回类型为jquery对象
                 */
                function getPanelBodyObj() {                    
                    return me.Obar.getPanelBodyObj(obarArgs.xtype);
                }

                /*按钮*/
                if (item.xtype == 'button') {
                    var btnId = getItemId();
                    var html = genBtnHtml(item,btnId);
                    if (item.position && item.position == "first") {
                        getPanelBodyObj().prepend(html);
                    }
                    else {
                       getPanelBodyObj().append(html);
                    }

                    //图标颜色
                    setIconColor(btnId, item.iconColor);

                    //注册事件
                    if (typeof item.handler == 'function') {
                        item.eventType = item.eventType || dftEventType;
                        $('#' + btnId).off(item.eventType).on(item.eventType, item.handler);
                    }
                    return btnId;
                }
                /*按钮组*/
                else if (item.xtype == 'btnGroup') {
                    if (!(item.children instanceof Array)) return;
                    var btnGroupId = getItemId('GroupItm');
                    var groupResult = genBtnGroupHtml(item, btnGroupId, getItemId);
                    var btnIDs = groupResult.childrenIDs; //按钮ID数组                    
                    var html = groupResult.html;
                    if (item.position && item.position == "first") {
                        getPanelBodyObj().prepend(html);
                    }
                    else {
                        getPanelBodyObj().append(html);
                    }
                    
                    for (var i = 0; i < item.children.length; i++) {
                        var childrenItem = item.children[i];
                        //图标颜色
                        setIconColor(btnIDs[i], childrenItem.iconColor);

                        if (childrenItem.xtype == 'html' || childrenItem.xtype == 'text') {
                            //注册事件
                            if (typeof childrenItem.handler == 'function') {
                                childrenItem.handler(); //直接执行逻辑
                            }
                        }
                        else {
                            //注册事件
                            if (typeof childrenItem.handler == 'function') {
                                childrenItem.eventType = childrenItem.eventType || dftEventType;
                                $('#' + btnIDs[i]).off(childrenItem.eventType).on(childrenItem.eventType, (function (cfgItem) {
                                    return function () {
                                        //子节点事件
                                        cfgItem.handler({
                                            sender: this,
                                            text: cfgItem.text || cfgItem,
                                            item: cfgItem
                                        });
                                    };
                                })(childrenItem));
                            }
                                //如果未注册事件，则可能使用统一事件
                            else if (typeof item.handler == 'function') {
                                item.eventType = item.eventType || dftEventType;
                                $('#' + btnIDs[i]).off(item.eventType).on(item.eventType, (function (cfgItem) {
                                    return function () {
                                        //父节点事件
                                        item.handler({
                                            sender: this,
                                            text: cfgItem.text || cfgItem,
                                            item: cfgItem
                                        });
                                    };
                                })(childrenItem));
                            }
                        }
                    }
                    return btnGroupId;
                }
                /*自定义HTML*/
                else if (item.xtype == 'html') {
                    if (item.position && item.position == "first") {
                        getPanelBodyObj().prepend(item.html);
                    }
                    else {
                        getPanelBodyObj().append(item.html);
                    }
                    //注册事件
                    if (typeof item.handler == 'function') {
                        item.handler(); //直接执行逻辑
                    }
                }
                /*单按钮下拉菜单：ddm: DropdownMenu*/
                else if (item.xtype == 'btnDdm') {
                    var btnGroupId = getItemId('GroupItm');
                    if (obarArgs.xtype == 'bbar' || obarArgs.xtype == 'pbar') {
                        item.dropup = item.dropup === false ? false : true; //显示方式是否为：向上弹出式菜单
                    }

                    var groupResult = genBtnDdmHtml(item, btnGroupId, getItemId);
                    var ddmItemIDs = groupResult.childrenIDs; //btnDropdownMenu下拉项ID数组
                    var html = groupResult.html;

                    if (item.position && item.position == "first") {
                       getPanelBodyObj().prepend(html);
                    }
                    else {
                       getPanelBodyObj().append(html);
                    }
                    for (var i = 0; i < item.children.length; i++) {
                        var childrenItem = item.children[i];
                        //注册事件
                        if (typeof childrenItem.handler == 'function') {
                            childrenItem.eventType = childrenItem.eventType || dftEventType;
                            $('#' + ddmItemIDs[i]).off(childrenItem.eventType).on(childrenItem.eventType, (function (cfgItem) {
                                return function () {
                                    //子节点事件
                                    cfgItem.handler({
                                        sender: this,
                                        text: cfgItem.text || cfgItem,
                                        item: cfgItem
                                    });
                                }
                            })(childrenItem));
                        }
                            //如果未注册事件，则可能使用统一事件
                        else if (typeof item.handler == 'function') {
                            item.eventType = item.eventType || dftEventType;
                            $('#' + ddmItemIDs[i]).off(item.eventType).on(item.eventType, (function (cfgItem) {
                                return function () {
                                    //父节点事件
                                    item.handler({
                                        sender: this,
                                        text: cfgItem.text || cfgItem,
                                        item: cfgItem
                                    });
                                }
                            })(childrenItem));
                        }
                    }
                    return btnGroupId;
                }
                /*文本*/
                else if (item.xtype == 'text') {
                    getPanelBodyObj().append(item.text);
                    //注册事件
                    if (typeof item.handler == 'function') {
                        item.handler(); //直接执行逻辑
                    }
                }

            }//end addItem

            /**
             * 新增操作工具栏查询项  
             * ----------------------------------------
             * 参数：obarArgs
             *  {
             *     xtype:    '操作栏类型：tbar、bbar、pbar'  【必填】,
             *     item:     '操作栏查询项' 【必填】,
             *     ...       '其他可能需要的参数'
             *  }
             * ----------------------------------------
             *  obarArgs.item的参数配置为：
             *  {   
             *     text:        '条件名',
             *     fieldName:   '条件字段', 
             *     id:          '可选的id'，
             *     dataType:    '详见ComplexModel的dataType。 default：16'  
             *                   DataType.Date=5      DataType.DateTime = 6 
             *                   DataType.Int32 = 11  DataType.String = 16    
             *                   DataType.Time = 17  
             *     children:[{  '配置children表示使用group模式，可从多个条件中选择一个进行查询,dateType为统一父级的类型'
             *         text: '',  
             *         fieldName,''
             *     }]
             *  }
             *
             */
            , addQueryItem: function (obarArgs) {
                var queryId = obarArgs.item.id || twiPrefix + 'QueryItm' + getRandom();
                var html = genQueryItemHtml(obarArgs.item, queryId,obarArgs.xtype);
                me.Obar.addItem({
                    xtype: obarArgs.xtype,
                    item: {
                        xtype: 'html',
                        html: html
                    }
                });

                //查询组注册选择事件
                if (obarArgs.item.children instanceof Array) {
                    $('#' + queryId).find('ul[' + genTwiFor(twiForQueryGroupUL, "none") + ']').find('a').off('click').click(function () {
                        var sltBtn = $(this).parent('li').parent('ul').siblings('button[' + genTwiFor(twiForQueryGroupBtn, "none") + ']');
                        sltBtn.html($(this).html() + '<span class="caret"></span>');
                        $('#' + queryId).find('input[' + twiFor + ']').attr(twiFor, $(this).attr(twiFor));
                    });
                }


                //注册查询事件
                if (obarArgs.item.isLastItem) {
                    $('#' + queryId).find('button[' + genTwiFor(twiForAutoQueryBtn, "none") + ']').off('click').click(function () {
                        var panelBody = me.Obar.getPanelBodyObj(obarArgs.xtype);
                        var queryItems = panelBody.find('div[' + genTwiFor(twiForQueryItem, "none") + ']').find('input[' + twiFor + ']');
                        var data = {};
                        var condition = [];
                        for (var i = 0; i < queryItems.length; i++) {
                            var inputItem = $(queryItems[i]);
                            data[inputItem.attr(twiFor)] = inputItem.val();
                            if (inputItem.val()) {
                                condition.push({
                                    Field: inputItem.attr(twiFor),
                                    Value: inputItem.val(),
                                    COperator: 6, //Like
                                    JOperator: 0
                                });
                            }
                        }
                        
                        execFn(me.config.quickQuery.handler)({
                            data: data,
                            condition: condition
                        });
                    });
                }
            }//end adddQueryItem

        }; //end Obar

        /**
         * 顶部工具栏 TopToolBar -> Tbar
         */
        me.Tbar = {
            /**
             * 初始化工具栏
             */
            init: function () {
                if (!me.config._showTbar) return;
                me.Tbar.addItem(me.config.toolbar);
                //初始化快速查询
                if (me.config.quickQuery && me.config.quickQuery.dock == "tbar") {
                    me.Tbar.addQueryItem(me.config.quickQuery.items);
                }
            } //end init             

            /**
             * 清空工具栏
             */
            , clear: function () {
                var me = this;
                if (me.config.tbar instanceof Array) {

                }
            }//end clear

            /**
             * 添加工具栏项
             * item参数详见：me.Obar.addItem
             */
            , addItem: function (item) {
                if (item instanceof Array) {
                    for (var i = 0; i < item.length; i++) {
                        me.Tbar.addItem(item[i]);
                    }
                }
                else if (typeof item == 'object') {
                    me.Obar.addItem({
                        xtype: tbarXtype,
                        item: item
                    });
                }
            }//end addItem

            /**
             * 添加顶部工具栏查询项
             * item参数详见：me.config.quickQuery.items配置
             */
             , addQueryItem: function (item) {
                 if (item instanceof Array) {
                     for (var i = 0; i < item.length; i++) {
                         if (i == item.length - 1) {
                             item[i].isLastItem = true; //标识下最后一个，为了加自动查询按钮
                         }
                         me.Tbar.addQueryItem(item[i]);
                     }
                 }
                 else if (typeof item == 'object') {
                     me.Obar.addQueryItem({
                         xtype: tbarXtype,
                         item: item
                     });
                 }
             }//end addQueryItem

            /**
             * 按照传入的数据，重新加载工具栏
             */
            , reload: function (tbar) {

            }//end reload
                       
            /**
             * 判断是否需要显示顶部工具栏 
             */
            , needShow: function () {
                var isShow = false;
                if (me.config.toolbar instanceof Array) {
                    isShow = true;
                }
                else if (me.config.quickQuery && me.config.quickQuery.dock == "tbar") {
                    isShow = true;
                }
                return isShow;
            }//end needShow

        }; //end Tbar

        /**
         * 底部工具栏 BottomToolbar -> Bbar
         */
        me.Bbar = {
            /**
             * 初始化底部工具栏
             */
            init: function () {
                if (!me.config._showBbar) return;

                //移动行按钮组
                if (me.config.showMoveRowGroup) {
                    me.Bbar.addMoveRowGroup();
                }

                //bbar配置
                if (me.config.bbar) {
                    me.Bbar.addItem(me.config.bbar);
                }

                //初始化快速查询
                if (me.config.quickQuery && me.config.quickQuery.dock == "bbar") {
                    me.Bbar.addQueryItem(me.config.quickQuery.items);
                }

            }//end init

            /**
             * 添加移动行按钮组
             */
            , addMoveRowGroup: function () {
                if (!me.config.showMoveRowGroup) return;
                me.Bbar.addItem({
                    xtype: 'btnGroup',
                    children:
                    [{
                        text: '至顶部',
                        iconCls: 'glyphicon-hand-up',
                        handler: function () {
                            me.rowUpToFirst();
                        }
                    }, {
                        text: '上移',
                        iconCls: 'glyphicon-arrow-up',
                        handler: function () {
                            me.rowUp();
                        }
                    }, {
                        text: '下移',
                        iconCls: 'glyphicon-arrow-down',
                        handler: function () {
                            me.rowDown();
                        }
                    }, {
                        text: '至底部',
                        iconCls: 'glyphicon-hand-down',
                        handler: function () {
                            me.rowDownToLast();
                        }
                    }]
                });
            }

            /**
             * 添加底部工具栏项
             * item参数详见：me.Obar.addItem
             */
            , addItem: function (item) {
                if (item instanceof Array) {
                    for (var i = 0; i < item.length; i++) {
                        me.Bbar.addItem(item[i]);
                    }
                }
                else if (typeof item == 'object') {
                    me.Obar.addItem({
                        xtype: bbarXtype,
                        item:item
                    });
                }

            }//end addItem

            /**
             * 添加顶部工具栏查询项
             * item参数详见：me.config.quickQuery.items配置
             */
             , addQueryItem: function (item) {
                 if (item instanceof Array) {
                     for (var i = 0; i < item.length; i++) {
                         if (i == item.length - 1) {
                             item[i].isLastItem = true; //标识下最后一个，为了加自动查询按钮
                         }
                         me.Bbar.addQueryItem(item[i]);
                     }
                 }
                 else if (typeof item == 'object') {
                     me.Obar.addQueryItem({
                         xtype: bbarXtype,
                         item: item
                     });
                 }
             }//end addQueryItem

            /**
             * 判断是否需要显示底部工具栏
             */
            , needShow: function () {
                var isShow = false;
                if (me.config.showMoveRowGroup) {
                    isShow = true;
                }
                else if (me.config.bbar) {
                    isShow = true;
                }
                else if (me.config.quickQuery && me.config.quickQuery.dock == "bbar") {
                    isShow = true;
                }
                return isShow;
            }//end needShowBbar

        };//end Bbar

        /**
         * 分页工具栏： PagingToolbar -> Pbar    【1.2.5+】
         */
        me.Pbar = {
            /**
             *  正在使用的分页参数，会自动赋值defaults。 
             */
            Vars: {
                activeModel: 'classic'  //当前激活的分页模式，如设置为“auto”会自动改变此值
                ,model: 'classic'       //classic、phone、bootstrap、auto
                , pageSize: 25          //每页显示记录数(默认25)
                , currentPage: 1        //当前页
                , startIndex: 0         //跳过的系列中指定的条数 默认为0
                , totalCount: 0         //总记录数,【不要直接赋值，应该使用setTotalCount方法】
                , isReloadPage:true     //重新加载数据，是否重置页码
                , pageCount: 1          //页数【计算出】
                , recordRange: '0'      //显示的记录范围，如：1-50
                , handler: null         //分页逻辑处理函数 
                , hasExtend: false      //用于标识是否和defaults进行过拷贝
                , ajax:null             //ajax远程调用参数
            } //end Vars

            /**
             * 初始化
             */
            ,init: function () {
                if (!me.Pbar.needPaging()) return;

                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars;

                if (pbarVars.model == "classic" || pbarVars.model == "auto") {
                    pbar.addClassicItems();
                    pbarVars.activeModel = 'classic';
                }
                else {
                    alert("当前分页模式暂不支持");
                }

                if (me.config.autoLoad) {
                    //加载分页数据
                    pbar.bind();
                }

            } //end init

            /**
             * 分页默认值             
             */
            , defaults: {
                model: 'classic'        //classic、phone、bootstrap、auto
                , pageSize: 25          //每页显示记录数(默认25)
                , currentPage: 1        //当前页
                , startIndex: 0         //跳过的系列中指定的条数 默认为0
                , totalCount: 0         //总记录数,【不要直接赋值，应该使用setTotalCount方法】
                , pageCount: 1          //页数【计算出】
                , recordRange:'0'       //显示的记录范围，如：1-50
                , handler: null         //分页逻辑处理函数                
            }//end defaults

            /**
             * 分页栏选择器相关参数
             */
            , sltPageSizeFor:'pbar_sps'   //每页条数
            , crtPageFor: 'pbar_crtp'     //当前页数字 crt: current
            , sltCrtPagFor: 'pbar_scp'    //下拉列表，选择页  SltCrtPage:Select Current Page
            , totalCountFor:'pbar_tc'     //总记录数
            , pageCountFor:'pbar_pc'      //共多少页
            , recordRangeFor: 'pbar_rr'   //多少条到多少条
            , firstFor: 'pbar_first'      //第一页
            , previousFor: 'pbar_prev'    //上一页
            , nextFor: 'pbar_next'        //下一页
            , lastFor: 'pbar_last'        //最后一页


            /**
             * 获取工具栏对象
             */
            , getPanelBodyObj: function (obXtype) {
                obXtype = obXtype || pbarXtype;
                return $('#' + me.frameId).children('.panel-body').children('div[' + genTwiFor(obXtype,'none') + ']');
            }//end getPanelBodyObj

            /**
             * 获取分页按钮对象
             */
            , getBtnObj: function (btnFor) {
                return me.Pbar.getPanelBodyObj().find('button[' + genTwiFor(btnFor, 'none') + ']');
            }

            /**
             * 添加经典模式的分页工具栏
             */
            , addClassicItems: function () {
                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars;
                var html = '<div class="btn-group btn-group-sm dropup">';
                html += '<button type="button" class="btn btn-default" '+genTwiFor(pbar.crtPageFor)+'>1</button>';
                html += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">';
                html += '<span class="glyphicon glyphicon-th-list"></span>';
                html += '<span class="sr-only">Toggle Dropdown</span>';
                html += '</button>';
                html += '<ul class="dropdown-menu twiPagingSlt" role="menu" ' + genTwiFor(pbar.sltCrtPagFor) + '>';
                html += '<li><a>1</a></li>';
                html += '</ul>';
                html += '</div>';
                me.Pbar.addItem({
                    xtype: 'btnGroup',
                    cls: 'form-inline',
                    children:
                    [{
                        xtype: 'html',
                        html: '<span>每页条数：</span><select class="form-control input-sm twiPageSize" ' + genTwiFor(pbar.sltPageSizeFor) + '><option>10</option><option>20</option><option selected="selected">25</option><option>30</option><option>50</option><option>80</option><option>100</option><option>150</option><option>200</option><option>500</option><option>1000</option></select>',
                        handler: function () {
                            pbar.getPanelBodyObj().find('select[' + genTwiFor(pbar.sltPageSizeFor, 'none') + ']').on('change', function () {
                                pbarVars.pageSize = parseInt($(this).val());
                                //重新计算页数后，显示到第一页
                                pbarVars.currentPage = 1;
                                pbar.bind();
                            });
                        }
                    }, {
                        iconCls: 'glyphicon-step-backward', //第一页
                        twiFor:pbar.firstFor,
                        handler: pbar.Handler.first
                    }, {
                        iconCls: 'glyphicon-chevron-left',   //上一页
                        twiFor:pbar.previousFor,
                        handler: pbar.Handler.previous
                    }, {
                        xtype: 'html',
                        html: html
                    }, {
                        iconCls: 'glyphicon-chevron-right',  //下一页
                        twiFor:pbar.nextFor,
                        handler: pbar.Handler.next
                    }, {
                        iconCls: 'glyphicon-step-forward',   //最后一页
                        twiFor:pbar.lastFor,
                        handler: pbar.Handler.last
                    }, {
                        xtype: 'html',
                        html: ' 显示 <span ' + genTwiFor(pbar.recordRangeFor) + '>0</span> 条，共 <span ' + genTwiFor(pbar.pageCountFor) + '>1</span> 页，共计 <span' + genTwiFor(pbar.totalCountFor) + '>0</span> 条'
                    }]
                });
            } //end addClassicItems

            /**
             * 添加底部工具栏项
             * @item参数详见：me.Obar.addItem
             */
            , addItem: function (item) {
                if (item instanceof Array) {
                    for (var i = 0; i < item.length; i++) {
                        me.Pbar.addItem(item[i]);
                    }
                }
                else if (typeof item == 'object') {
                    me.Obar.addItem({
                        xtype: pbarXtype,
                        item: item
                    });
                }

            }//end addItem

            /**
             * 是否需要分页
             */
            , needPaging: function () {                
                if (typeof me.config.paging == 'undefined') {
                    me.config.paging = false;
                    return false;
                }
                else if (typeof me.config.paging == 'boolean') {
                    return me.config.paging;                 
                }
                else if (typeof me.config.paging == 'object') {
                    var pbarVars = me.Pbar.Vars;
                    //只有第一次才进行默认值处理
                    if (!pbarVars.hasExtend) {
                        pbarVars = $.extend(pbarVars, me.config.paging);
                        pbarVars.hasExtend = true;
                    }
                    return true;
                }
                return false;
            }//end needPaging

            , needShow: function () {
                return me.Pbar.needPaging();
            }//end needShow

            /**
             * 设置分页信息指定项的值
             * @itmFor: twiFor对应的值
             * @itmVal: 显示的值
             */
            , setInfoItemText: function (itmFor,itmVal) {
                me.Pbar.getPanelBodyObj().find('span[' + genTwiFor(itmFor,'none') + ']').html(itmVal);
            }

            /**
             * 设置当前页的值
             * @itmVal: 显示的值
             */
            , setCrtPageText: function (itmVal) {
                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars;
                pbar.getPanelBodyObj().find('button[' + genTwiFor(pbar.crtPageFor, 'none') + ']').html(itmVal);

                //当前页修改后需要修改记录区间
                pbar.setRecordRegion();
            }

            /**
             * 设置总记录条数，不要试图对totalCount属性直接赋值，应调此方法完成赋值操作
             */
            , setTotalCount: function (totalCount) {
                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars;
                pbarVars.totalCount = totalCount > 0 ? totalCount : 0;                
                pbar.setInfoItemText(pbar.totalCountFor, pbarVars.totalCount);

                //设置页数
                pbar.setPageCount();                

            }//setTotalCount

            /**
             * 设置页数
             */
            , setPageCount: function () {
                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars;
                var pageCount = 1;
                if (pbarVars.totalCount > 0) {
                    pageCount = Math.ceil((pbarVars.totalCount) / parseFloat(pbarVars.pageSize));
                }
                pbarVars.pageCount = pageCount;
                pbar.setInfoItemText(pbar.pageCountFor, pbarVars.pageCount);

                //当前页
                pbar.setCrtPageText(pbarVars.currentPage);
                
                //下拉选择页重新赋值
                pbar.setSltCrtPage();

                //设置按钮状态
                pbar.setBtnState();

            }//end setPageCount

            /**
             * 设置显示记录区间（格式如：1-50）
             */
            , setRecordRegion: function () {
                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars;
                var recordRegion = "0";
                //只有一页
                if (pbarVars.pageCount == 1) {
                    recordRegion = "1-" + pbarVars.totalCount;
                }
                //有多页
                else if (pbarVars.pageCount > 1) {
                    if (pbarVars.currentPage == 1) //当前显示为第一页
                    {
                        recordRegion = "1-" + pbarVars.pageSize;
                    }
                    else if (pbarVars.currentPage == pbarVars.pageCount) //当前显示为最后一页
                    {
                        recordRegion = ((pbarVars.currentPage - 1) * pbarVars.pageSize + 1) + "-" + pbarVars.totalCount;
                    }
                    else //中间页
                    {
                        recordRegion = ((pbarVars.currentPage - 1) * pbarVars.pageSize + 1) + "-" + pbarVars.currentPage * pbarVars.pageSize;
                    }
                }
                pbarVars.recordRange = recordRegion;
                pbar.setInfoItemText(pbar.recordRangeFor, pbarVars.recordRange);

            }//end setRecordRegion

            /**
             * 设置页数选择项:SltCrtPage:Select Current Page
             */
            , setSltCrtPage: function () {
                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars;
                var sltCrtPage = pbar.getPanelBodyObj().find('ul[' + genTwiFor(pbar.sltCrtPagFor, 'none') + ']');
                sltCrtPage.empty();
                for (var i = 0; i < pbarVars.pageCount; i++) {
                    sltCrtPage.append('<li><a>' + (i + 1) + '</a></li>');
                }
                //跳转到指定页事件
                pbar.getPanelBodyObj().find('ul[' + genTwiFor(pbar.sltCrtPagFor, 'none') + ']').find('a').off('click').click(function () {
                    pbar.Handler.toPage(parseInt($(this).html()));
                });
            }//setSltCrtPage


            /**
             * 设置分页按钮的状态
             */
            , setBtnState: function () {
                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars;
                if (pbarVars.pageCount > 1) {
                    if (pbarVars.currentPage == 1) {
                        pbar.getBtnObj(pbar.firstFor).attr('disabled', "disabled");
                        pbar.getBtnObj(pbar.previousFor).attr('disabled', "disabled");
                        pbar.getBtnObj(pbar.nextFor).removeAttr('disabled');
                        pbar.getBtnObj(pbar.lastFor).removeAttr('disabled');
                    }
                    else if (pbarVars.currentPage == pbarVars.pageCount) {
                        pbar.getBtnObj(pbar.firstFor).removeAttr('disabled');
                        pbar.getBtnObj(pbar.previousFor).removeAttr('disabled');
                        pbar.getBtnObj(pbar.nextFor).attr('disabled', "disabled");
                        pbar.getBtnObj(pbar.lastFor).attr('disabled', "disabled");
                    }
                    else {
                        pbar.getBtnObj(pbar.firstFor).removeAttr('disabled');
                        pbar.getBtnObj(pbar.previousFor).removeAttr('disabled');
                        pbar.getBtnObj(pbar.nextFor).removeAttr('disabled');
                        pbar.getBtnObj(pbar.lastFor).removeAttr('disabled');
                    }
                }
                else {
                    pbar.getBtnObj(pbar.firstFor).attr('disabled', "disabled");
                    pbar.getBtnObj(pbar.previousFor).attr('disabled', "disabled");
                    pbar.getBtnObj(pbar.nextFor).attr('disabled', "disabled");
                    pbar.getBtnObj(pbar.lastFor).attr('disabled', "disabled");
                }
            }//setBtnState

            /**
             * 分页绑定事件：加载数据或分页相关参数改变后，需要处理对应的逻辑
             */
            , bind: function () {
                var pbar = me.Pbar,
                    pbarVars = me.Pbar.Vars,
                    pFn = me.Pbar.Handler;

                //ajax配置
                if (!pbarVars.ajax && typeof config.ajax == 'object') {
                    pbarVars.ajax = $.extend({}, config.ajax);
                    delete pbarVars.ajax.success;
                    pbarVars.ajax.success = function (twiReturn, textStatus, jqXHR) {
                        //加载数据
                        me.loadData(twiReturn.data, pbarVars.pageSize);
                        pbar.setTotalCount(twiReturn.totalCount);

                        if (typeof config.ajax.success == 'function') {
                            config.ajax.success(twiReturn, textStatus, jqXHR);
                            config.ajax.success = undefined;  //只执行一遍
                        }
                    };
                }
                if (pbarVars.ajax) {
                    pbarVars.ajax.data.startIndex = pbarVars.startIndex;
                    pbarVars.ajax.data.pageSize = pbarVars.pageSize;
                    Twi.Ajax(pbarVars.ajax);
                }

            }//end bind

            /**
             * 分页自处理事件
             */
            , Handler: {
                /**
                 *  第一页
                 */
                first: function () {
                    var pbar = me.Pbar,
                        pbarVars = me.Pbar.Vars;
                    if (pbarVars.currentPage != 1) {
                        pbarVars.currentPage = 1;
                        pbarVars.startIndex = 0;
                        pbar.setBtnState();
                        pbar.bind();
                    }
                }//end first

                /**
                 * 上一页
                 */
                ,previous:function(){
                    var pbar = me.Pbar,
                        pbarVars = me.Pbar.Vars;
                    if (pbarVars.currentPage > 1) {
                        pbarVars.currentPage -= 1;
                        pbarVars.startIndex -= pbarVars.pageSize;
                        pbar.setBtnState();
                        pbar.bind();
                    }
                } //end previous

                /**
                 * 下一页
                 */
                , next: function () {
                    var pbar = me.Pbar,
                        pbarVars = me.Pbar.Vars;
                    if (pbarVars.currentPage < pbarVars.pageCount) {
                        pbarVars.currentPage += 1;
                        pbarVars.startIndex += pbarVars.pageSize;
                        pbar.setBtnState();
                        pbar.bind();
                    }
                }//end next

                /**
                 * 最后一页
                 */
                , last: function () {
                    var pbar = me.Pbar,
                        pbarVars = me.Pbar.Vars;
                    if (pbarVars.currentPage != pbarVars.pageCount) {
                        pbarVars.currentPage = pbarVars.pageCount;
                        pbarVars.startIndex = (pbarVars.currentPage - 1) * pbarVars.pageSize;
                        pbar.setBtnState();
                        pbar.bind();
                    }
                }//end last

                /**
                 * 到指定页
                 * @page： '第page页，page从1开始'
                 */
                , toPage: function (page) {
                    var pbar = me.Pbar,
                        pbarVars = me.Pbar.Vars;
                    page = page < 1 ? 1 : page;
                    page = page > pbarVars.totalCount ? pbarVars.totalCount : page;
                    if (pbarVars.currentPage != page) {
                        pbarVars.currentPage = page;
                        pbarVars.startIndex = (pbarVars.currentPage - 1) * pbarVars.pageSize;
                        pbar.setBtnState();
                        pbar.bind();
                    }
                }//toPage

            }//end handler

        }; //end PBar

        /**
         * 生成主框架 MainFrame
         */
        (function genMainFrame() {
            /*主框体*/
            var mainFrameHtml = '';
            me.config.skin = me.config.skin || dftSkin;
            me.config.skin = me.config.skin == dftSkin ? '' : 'panel-' + me.config.skin;
            mainFrameHtml += '<div id="' + me.frameId + '" class="twiDtMainFrame panel panel-default ' + me.config.skin + '">';

            /**
             *生成title标题HTML
             */
            function getTitleHtml() {
                var titleHtml = '';
                if (config.title) {
                    titleHtml = '<div id="' + me.titleId + '" class="panel-heading">' + config.title + '</div>';
                }
                return titleHtml;
            }
            mainFrameHtml += getTitleHtml();

            //是否显示底部工具栏  【1.2.0+】   Tbar：TopToolbar
            me.config._showTbar = false;
            if (me.Tbar.needShow()) {
                //tbar 放在panel-body中
                mainFrameHtml += '<div class="panel-body tbarBottomBorder">';
                mainFrameHtml += '<div ' + genTwiFor(twiForTbar) + ' class="btn-toolbar form-inline"></div>';
                mainFrameHtml += '</div>';
                me.config._showTbar = true;
            }
            mainFrameHtml += '<div ' + genTwiFor(twiForTableContainer) + ' class="twiTableContainer"></div>';

            //是否显示底部工具栏  【1.2.3+】   Bbar：BottomToolbar
            me.config._showBbar = false; 
            if (me.Bbar.needShow()) {
                //bbar 放在panel-body中
                mainFrameHtml += '<div class="panel-body bbarTopBorder">';
                mainFrameHtml += '<div ' + genTwiFor(twiForBbar) + ' class="btn-toolbar form-inline"></div>'
                mainFrameHtml += '</div>';
                me.config._showBbar = true;
            }

            //分页工具栏  【1.2.5+】 Pbar:PagingToolbar 
            if (me.Pbar.needPaging()) {
                mainFrameHtml += '<div class="panel-body bbarTopBorder">';
                mainFrameHtml += '<div ' + genTwiFor(twiForPbar) + ' class="btn-toolbar"></div>'
                mainFrameHtml += '</div>';
            }

            mainFrameHtml += '</div>';
            $(config.renderTo).append(mainFrameHtml);

            //宽度设置
            if (typeof me.config.width == 'number') {
                $('#' + me.frameId).css('width', me.config.width);
            }
        })();

        //初始化工具栏
        me.Tbar.init();

        //初始化底部工具栏
        me.Bbar.init();        
              

        /**
         * 生成head表头HTML
         */
        function getTableHeadHtml() {
            var headHtml = "";
            headHtml += '<thead>';
            headHtml += '<tr>';

            //行号列
            if (config._showRowNumber) {
                headHtml += '<th style="text-align:center;width:' + config.rownumberer.width + 'px;"><div>' + config.rownumberer.text + '</div></th>';
            }

            //选择框列
            if (config._showCheckBox) {
                headHtml += '<th style="text-align:center;width:' + config.checkBoxCol.width + 'px;">';
                headHtml += config.multiSelect ? '<input type="checkbox" twiDtChkType="all"/>' : "#";
                headHtml += '</th>';
            }

            //数据列
            for (var i = 0; i < config.columns.length; i++) {
                var col = config.columns[i];
                if (col.hidden === true) { continue; }
                if (typeof col.width == 'number') {
                    headHtml += '<th style="width:' + col.width + 'px;"><div' + genTwiFor(twiForThData) + '>' + col.text;
                }
                else {
                    headHtml += '<th><div' + genTwiFor(twiForThData) + '>' + col.text;
                }
                //列排序图标
                if (config.sortable && !(col.orderFields === false)) {
                    if (!col.orderFields) {
                        col.orderFields = col.fieldName; //未配置取字段名排序
                    }
                    headHtml += '<span orderfields="' + col.orderFields + '" class="glyphicon glyphicon-arrow-up hidden"></span><span class="glyphicon glyphicon-arrow-down hidden"></span>';
                }
                headHtml += '</div></th>';
            }

            headHtml += '</tr>';
            headHtml += '</thead>';
            return headHtml;
        }
        me._headHtml = getTableHeadHtml();

        /*表格*/
        var html = '';
        html += '<table id=' + me.id + ' class="table table-hover table-bordered';
        if (typeof me.config.striped == 'boolean' && me.config.striped) {
            //隔行变色
            html += ' table-striped';
        }
        html += '">';
        html += me._headHtml;
        html += '<tbody></tbody>';
        html += '</table>';
        $('#' + me.frameId).children('div[' + twiFor + '="tableContainer"]').append(html);        

        //注册全选和反选事件
        if (this.config._showCheckBox) {
            $('#' + me.id).children('thead').find(':checkbox[twiDtChkType="all"]').off('click').click(function () {
                if ($(this).prop('checked')) {
                    me.selectAll();
                }
                else {
                    me.unSelectAll();
                }
            });
        }

        //注册列排序事件
        if (config.sortable) {
            $('#' + me.id).find('thead>tr>th>div[' + genTwiFor(twiForThData, 'none') + ']').off('click').click(function () {
                var glySpan = $(this).children('.glyphicon');
                if (!glySpan || glySpan.length == 0) return;
                var firstIsHidden = $(glySpan[0]).hasClass('hidden');
                $(this).parent('th').parent('tr').find('th>div').children('.glyphicon').addClass('hidden');
                if (firstIsHidden) {
                    $(glySpan[0]).removeClass('hidden');  //升序
                    me._orderFields = $(glySpan[0]).attr('orderfields') + ' ASC';                    
                }
                else {
                    $(glySpan[1]).removeClass('hidden');  //降序
                    me._orderFields = $(glySpan[0]).attr('orderfields') + ' DESC'; //只在glySpan[0]中配了orderfields属性
                }
                if (typeof config.sortFn == 'function') {
                    //调用排序函数
                    config.sortFn({
                        orderFields: me._orderFields
                    });
                }
            });
        }

        //初始化分页，并可能加载远程数据
        me.Pbar.init();

        //不分页自动加载数据
        if (me.config.autoLoad && !me.Pbar.needPaging()) {
            var ajax = $.extend({}, config.ajax);
            delete ajax.success;
            ajax.success = function (twiReturn, textStatus, jqXHR) {
                //加载数据
                me.loadData(twiReturn.data);
                if (typeof config.ajax.success == 'function') {
                    config.ajax.success(twiReturn, textStatus, jqXHR);
                }
            };
            Twi.Ajax(ajax);
        }

        /**
         * 获取对应操作工具栏类型的panel对象，返回类型为jquery对象。
         * @obXtype： 如tbar、bbar、pbar等
         */
        me.getPanelBodyObj = function (obXtype) {           
            return $('#' + me.frameId).children('.panel-body').children('div[' + genTwiFor(obXtype, "none") + ']');
        }//end getPanelBodyObj

        //获取占据的高度    2015-04-09 将height()方法换成outerHeight()
        me.getTokenHeight = function () {
            var tokenHeight = 0;
            if (me.config.title) {
                tokenHeight += $('#' + me.titleId).outerHeight();
            }
            if (me.Tbar.needShow()) {
                tokenHeight += me.getPanelBodyObj(tbarXtype).parent().outerHeight();
            }
            if (me.Bbar.needShow()) {
                tokenHeight += me.getPanelBodyObj(bbarXtype).parent().outerHeight();
            }
            if (me.Pbar.needShow()) {
                tokenHeight += me.getPanelBodyObj(pbarXtype).parent().outerHeight();
            }
            //2015-03-20  修正bbar、pbar同时存在的高度计算问题。  2015-04-09 使用outerHeight()就不存在此问题
            //if (me.Bbar.needShow() && me.Pbar.needShow()) {
            //    tokenHeight += 10;
            //}
            return tokenHeight;
        }
        
        //高度设置
        if (typeof me.config.height == 'number') {
            $('#' + me.frameId).children('div[' + twiFor + '="tableContainer"]').css('height', me.config.height - me.getTokenHeight());
        }
    }

    /**
     * 获取Id
     */
    Twi.DataTable.prototype.getId = function () {
        return this.id;
    }

    /**
     * 加载数据
     * @data: 【必填参数】，record对象数组，一般传twi.data
     * @len:   加载的数据条数，可选【1.2.5+】
     */
    Twi.DataTable.prototype.loadData = function (data,len) {
        if (!(data instanceof Array)) {
            return;
        }

        var tableSelf = this;
        var me = this;        
        if (me.config._showAsTreeGrid) {
            //treeGrid数据格式转换
            var newData = getTreeGridData(data, me.config.treeGrid);
            //将有父节点，但是父节点未查出数据的独立子节点数据加入。【1.3.5+】
            for (var i = 0; i < data.length; i++) {
                var record = data[i];
                if (!record._twiTgdIsOver) {
                    record._twiTgdIsLeaf = true;
                    record._twiChildrenCount = 0;
                    record._twiTgdLevel = -1; //-1：表示虽然有父节点，但是把当前节点直接作为父节点（且为显示为叶子节点，暂时不管是否还有子节点）
                    newData.push(record);
                }
            }              
            data = newData;
        }
        me._data = data;
        me._idFieldValues = [];
        var tgCfg = me.config.treeGrid;
        

        //先清空数据
        $('#' + me.id).children('tbody').empty();
        //如果有全选，需要去掉选择状态
        var cktAll = $('#' + me.id).children('thead').find(':checkbox[twiDtChkType="all"]');
        if (cktAll.length > 0) {
            cktAll.prop("checked", false);
        }

        len = len || data.length;
        len = len > data.length ? data.length : len;

        /**
         * 获取转换后的显示值
         */
        function getColValue(renderer, colFormat, colValue,rowData) {
            if (colFormat && typeof colFormat == "string") {
                colValue = me.getColFormat(colFormat)(colValue);
            }
            else if (renderer && typeof renderer == 'function') {
                colValue = renderer(colValue,rowData);
            }
            return colValue;
        }

        /*添加数据行HTML*/
        for (var i = 0; i < len; i++) {
            var html = '<tr rowIndex="' + i + '">';
            //序号列
            if (me.config._showRowNumber) {
                html += '<td style="text-align:center;">' + (i + 1) + '</td>';
            }
            //数据行选择框列
            if (me.config._showCheckBox) {
                html += '<td><input type="checkbox" twiDtChkType="row"/></td>';
            }
            //数据列
            var colValue = colWidth = colStyleWidth = "";
            for (var j = 0; j < me.config.columns.length; j++) {
                if (me.config.columns[j].hidden === true) { continue; }
                colValue = data[i][me.config.columns[j].fieldName];
                colWidth = me.config.columns[j].width;
                var colFormat = me.config.columns[j].format;
                colValue = getColValue(me.config.columns[j].renderer, colFormat, colValue, data[i]);
                //if (colFormat && typeof colFormat == "string") {
                //    colValue = me.getColFormat(colFormat)(colValue);
                //}
                //else if (me.config.columns[j].renderer && typeof me.config.columns[j].renderer == 'function') {
                //    colValue = me.config.columns[j].renderer(colValue);
                //}
                colStyleWidth = "";
                if (typeof colWidth == 'number') {
                    colStyleWidth = ' style="width:' + colWidth + 'px;" ';
                }
                if (j == 0 && me.config._showAsTreeGrid) {
                    var tgIconCls = ''; 
                    //根节点
                    if ('' + data[i][tgCfg.parentIDField] == tgCfg.rootParentIDValue) {
                        if (data[i]._twiTgdIsLeaf) {
                            tgIconCls = tgCfg[tgCfg.model + tgModelPostfix].onlyRoot;
                        }
                        else {
                            tgIconCls = ' twiTgParent ' + tgCfg[tgCfg.model + tgModelPostfix].open;
                        }
                    }
                    else { //子节点
                        if (data[i]._twiTgdIsLeaf) {
                            if (data[i]._twiTgdLevel == -1) {
                                //childRoot
                                tgIconCls = tgCfg[tgCfg.model + tgModelPostfix].childRoot;
                            }
                            else {
                                tgIconCls = tgCfg[tgCfg.model + tgModelPostfix].leaf;
                            }
                        }
                        else {
                            tgIconCls = ' twiTgParent ' + tgCfg[tgCfg.model + tgModelPostfix].open;
                        }
                    }
                    var tgIconStyle = '';
                    if (data[i]._twiTgdLevel > 0) {
                        tgIconStyle = ' style="padding-left:' + (data[i]._twiTgdLevel * tgCfg.preLevelPadding) + 'px;" ';
                    }
                    var tgIcon = '<span class="twiTreeGridIcon glyphicon ' + tgIconCls + '" ' + genTwiFor(twiForTreeGridIcon) + tgIconStyle + ' aria-hidden="true"></span>';
                    colValue = tgIcon + colValue;
                }
                html += '<td configColIndex="' + j + '"><div ' + colStyleWidth + '>' + colValue + '</div></td>';
            }
            html += '</tr>';
            $('#' + me.id).children('tbody').append(html);

            if (typeof me.config.idField == 'string') {
                me._idFieldValues.push(data[i][me.config.idField]);
            }

            //jquery data 数据存储
            var lastAppendTr = $('#' + me.id).children('tbody').children('tr:last');
            lastAppendTr.data('rowIndex', lastAppendTr.attr('rowIndex'));
            lastAppendTr.data('rowData', me._data[lastAppendTr.data('rowIndex')]);
        }

        /*行操作、选择行事件*/
        $('#' + me.id).children('tbody').children('tr').off('click').on('click', function () {
            //当前选择行样式
            $('#' + me.id).children('tbody').children('tr').removeClass('twiSelected');
            $(this).addClass('twiSelected');

            //如果是单选模式
            if (!me.config.multiSelect) {
                //单选时，选择行会自动勾选
                me.unSelectAll();
                $(this).find(':checkbox[twiDtChkType="row"]').prop('checked', true);
            }

            //自定义事件 rowclick
            me.fireEvent("rowclick", {
                tableSelf: tableSelf,
                rowData: $(this).data('rowData'),
                rowIndex: $(this).data('rowIndex')
            });
        });

        /*如果有选择框列，注册checkbox选择和反选事件*/
        if (this.config._showCheckBox) {
            $('#' + me.id).children('tbody').find(':checkbox[twiDtChkType="row"]').off('click').click(function (event) {
                //checkbox 操作阻止事件冒泡
                event.stopPropagation();

                if ($(this).prop('checked')) {
                    //当前选择行样式
                    $('#' + me.id).children('tbody').children('tr').removeClass('twiSelected');
                    $(this).parent().parent('tr').addClass('twiSelected');

                    if (me.config.multiSelect) {
                        var isAllSeleted = true; //是否数据行都选中了
                        $('#' + me.id).children('tbody').find(':checkbox[twiDtChkType="row"]').each(function () {
                            if (!$(this).prop('checked')) {
                                isAllSeleted = false;
                                return false;
                            }
                        });
                        $('#' + me.id).children('thead').find(':checkbox[twiDtChkType="all"]').prop('checked', isAllSeleted);
                    }
                    else {
                        //单选时，表头的checkbox不显示，只需要取消其他checkbox选择状态
                        me.unSelectAll();
                        $(this).prop('checked', true);
                    }
                }
                else {
                    //取消选择时把选择行样式去掉
                    $(this).parent().parent('tr').removeClass('twiSelected');
                    if (me.config.multiSelect) {
                        //取消全选
                        $('#' + me.id).children('thead').find(':checkbox[twiDtChkType="all"]').prop('checked', false);
                    }
                }
            });
        }


        /*单元格单击事件：cellclick*/
        for (var i = 0; i < me.config.columns.length; i++) {
            var cellclick = me.config.columns[i].cellclick;
            //如果列配置了cellclick
            if (typeof cellclick == 'function' || me.config.columns[i].editable) {
                $('#' + me.id).children('tbody').children('tr').children('td[configColIndex=' + i + ']').off('click').on('click', function () {
                    var configColIndex = $(this).attr("configColIndex");
                    var rowData = $(this).parent("tr").data('rowData')
                    var rowIndex = $(this).parent("tr").data('rowIndex');
                    var colFieldName = me.config.columns[configColIndex].fieldName; //列字段
                    var colData = rowData[colFieldName];
                    var colRenderer = function (val) {
                        var renderer = me.config.columns[configColIndex].renderer;
                        var format = me.config.columns[configColIndex].format;
                        return getColValue(renderer, format, val, rowData);
                    };
                    var editable = me.config.columns[configColIndex].editable;
                    if (editable === true) {
                        editable = {
                            isValidate: function (val) { return true }
                        };
                    }

                    var editCell = this;
                    //是否启用编辑
                    if (me.config.columns[configColIndex].editable) {
                        var editHtml = '<div class="input-group input-group-sm" ' + genTwiFor(twiForCellEidtItem) + '>';
                        editHtml += '<input type="text" class="form-control twiCellEditInput" value="' + colData + '"/>';
                        editHtml += '<span class="input-group-btn">';
                        editHtml += '<button class="btn btn-default" type="button" ' + genTwiFor(twiForCellEditSave) + '>';
                        editHtml += '<span class="glyphicon glyphicon-ok" style="color:#69aa46;" aria-hidden="true"></span>';
                        editHtml += '</button>';
                        editHtml += '<button class="btn btn-default" type="button" ' + genTwiFor(twiForCellEditCancel) + '>';
                        editHtml += '<span class="glyphicon glyphicon-remove" style="color:#dd5a43;" aria-hidden="true"></span>';
                        editHtml += '</button>';
                        editHtml += '</span>';
                        editHtml += '</div>';
                        $(editCell).html(editHtml);
                        
                        //阻止冒泡
                        $(editCell).children('div[' + genTwiFor(twiForCellEidtItem, "none") + ']').off('click').on('click', function (e) {
                            e.stopPropagation();
                        });

                        //保存
                        $(editCell).find('button[' + genTwiFor(twiForCellEditSave, "none") + ']').off('click').on('click', function (e) {
                            e.stopPropagation();
                            var newValue = $(editCell).find('.twiCellEditInput').val();
                            
                            //值不变不做任何操作,相当于取消
                            if (colData == newValue) {
                                $(editCell).html('<div>' + colRenderer(colData) + '</div>');
                                return;
                            };
                            //验证数据格式                            
                            if (editable.isValidate(newValue)) {                                
                                $(editCell).html('<div>' + colRenderer(newValue) + '</div>');

                                //修改成功更新现有值
                                rowData = me.getData()[rowIndex];
                                rowData[colFieldName] = newValue;
                                colData = rowData[colFieldName]
                                $(editCell).parent("tr").data('rowData', rowData);

                                execFn(editable.success)({
                                    tableSelf: tableSelf,
                                    rowData: rowData,
                                    rowIndex: rowIndex,
                                    colData: colData,
                                    configColIndex: configColIndex,
                                    colFieldName: colFieldName
                                });//验证成功执行
                            }
                            else {                                
                                execFn(editable.failed)();//验证失败执行
                            }
                        });

                        //取消
                        $(editCell).find('button[' + genTwiFor(twiForCellEditCancel, "none") + ']').off('click').on('click', function (e) {                           
                            e.stopPropagation();
                            $(editCell).html('<div>' + colRenderer(colData) + '</div>');
                        });
                        
                    }
                    else {
                        //处理自定义单击单元格事件
                        me.config.columns[configColIndex].cellclick({
                            tableSelf: tableSelf,
                            rowData: rowData,
                            rowIndex: rowIndex,
                            colData: colData,
                            configColIndex: configColIndex,
                            colFieldName: colFieldName
                        });
                    }                    
                });
            }
        }

        /*如果是TreeGrid，注册折叠事件*/
        if (me.config._showAsTreeGrid) {
            $('#' + me.id).find('tbody>tr>td').find('.twiTgParent').off('click').click(function (event) {
                var sltIcon = $(this);
                var rowIndex = parseInt(sltIcon.closest('tr').attr('rowIndex'));
                var rowData = me.getData()[rowIndex];
                var closeCls = tgCfg[tgCfg.model + tgModelPostfix].close;
                var openCls = tgCfg[tgCfg.model + tgModelPostfix].open;
                if (sltIcon.hasClass(openCls)) {
                    $('#' + me.id).find('tbody>tr').slice(rowIndex + 1, rowIndex + 1 + rowData._twiChildrenCount).addClass('hidden');
                    sltIcon.removeClass(openCls).addClass(closeCls);
                }
                else if (sltIcon.hasClass(tgCfg[tgCfg.model + tgModelPostfix].close)) {
                    $('#' + me.id).find('tbody>tr').slice(rowIndex + 1, rowIndex + 1 + rowData._twiChildrenCount).each(function () {
                        //只显示直接子节点
                        if ($(this).data('rowData')[tgCfg.parentIDField] == rowData[tgCfg.idField]) {
                            $(this).removeClass('hidden');
                        }
                        //如果直接子节点是打开状态图标，触发对于子节点打开
                        if ($(this).find('.twiTgParent').hasClass(openCls)) {
                            $(this).find('.twiTgParent').removeClass(openCls).addClass(closeCls).click();
                        }
                    });
                    sltIcon.removeClass(closeCls).addClass(openCls);
                }
                event.stopPropagation();
            });
        }
        
    }

    /**
     * 修改选中行的数据【1.2.1+】
     * @newData: 【必填参数】 需要修改的键值对对象。如：{FCode:"001",FName:"xzh"}表示把选中项的FCode的值都改为"001",FName改为"xzh".
     * 注：修改后会自动刷新表格，并会选择修改前的行数据
     */
    Twi.DataTable.prototype.editData = function (newData) {
        if (!newData) return;
        var me = this;
        var selectionsIndex = me.getSelectionsIndex();
        var data = me.getData();
        for (var i = 0; i < selectionsIndex.length; i++) {
            var rowData = data[selectionsIndex[i]];
            for (j in data[selectionsIndex[i]]) {
                if (j && typeof rowData[j] != 'function') {
                    if (newData[j] || newData[j] == "") {
                        rowData[j] = newData[j];
                    }
                }
            }
        }
        //刷新表格
        me.refresh();

        //样式显示修改过的数据
        for (var i = 0; i < selectionsIndex.length; i++) {
            me.checkedByIndex(selectionsIndex[i]);
            if (me.config._showCheckBox) {
                $('#' + me.id).children('tbody').find('tr').eq(selectionsIndex[i]).addClass('twiSelected');
            }
        }
    }

    /**
     * 刷新【1.2.1+】
     */
    Twi.DataTable.prototype.refresh = function () {
        var me = this;
        me.loadData(me._data);
    }

    /**
     * 按照指定的参数，重新加载数据 【1.2.6+】
     * @ajaxConfig： ajax参数 【必填】
     */
    Twi.DataTable.prototype.reload = function (ajaxConfig) {
        var me = this;        
        if (me.Pbar.needPaging()) {
            //分页
            me.config.ajax = ajaxConfig;
            me.Pbar.Vars.ajax = null;
            //是否重置页码
            if (me.Pbar.Vars.isReloadPage || me.Pbar.Vars.currentPage <= 1) {
                me.Pbar.Vars.currentPage = 0; //故意设置为不等于1，就是为了first事件有效
                me.Pbar.Handler.first();
            }
            else {
                var page = me.Pbar.Vars.currentPage + 0;
                me.Pbar.Vars.currentPage = 0;
                me.Pbar.Handler.toPage(page);  //【1.3.5+】
            }
        }
        else {
            var ajax = $.extend({}, ajaxConfig);
            delete ajax.success;
            ajax.success = function (twiReturn, textStatus, jqXHR) {
                //加载数据
                me.loadData(twiReturn.data);
                if (typeof ajaxConfig.success == 'function') {
                    ajaxConfig.success(twiReturn, textStatus, jqXHR);
                }
            };
            Twi.Ajax(ajax);
        }
    }

    /**
     * 重新设置大小【1.2.8+】
     * @config.width: 需要设置的新宽度值，不带px,[可只设置宽度]
     * @config.height:需要设置的新高度值，不带px,[可只设置高度]
     * 
     */
    Twi.DataTable.prototype.resize = function (config) {
        var me = this;
        if (config.width) {
            me.setWidth(config.width);
        }
        if (config.height) {
            me.setHeight(config.height);
        }
    }

    /**
     * 设置宽度【1.2.8+】
     * @width：宽度值，不带px
     */
    Twi.DataTable.prototype.setWidth = function (width) {
        if (typeof width == 'number') {
            $('#' + this.frameId).css('width', width);
        }
    }

    /**
     * 设置高度【1.2.8+】
     * @height：高度值，不带px
     */
    Twi.DataTable.prototype.setHeight = function (height) {
        var me = this;
        if (typeof height == 'number') {
            var tableContainer = $('#' + me.frameId).children('div[' + genTwiFor(twiForTableContainer,"none") + ']');
            tableContainer.css('height', parseFloat(height) - me.getTokenHeight());
        }
    }

    /**
     * 获取数据源数据 【1.2.1+】
     * @Return： 返回值 me._data：[],
     */
    Twi.DataTable.prototype.getData = function () {
        return this._data || [];
    }

    /**
     * 获取最后选择行信息【仅限单选模式有效,多选请使用getSelections()】
     * 
     */
    Twi.DataTable.prototype.getLastSelected = function () {
        var selections = this.getSelections();
        if (selections.length > 0) {
            return selections[0]
        }
        return undefined;
    }

    /**
     * 获取选择的集合
     */
    Twi.DataTable.prototype.getSelections = function () {
        var selections = [];
        //有选择框列的情况
        if (this.config._showCheckBox) {
            $('#' + this.id).children('tbody').find(':checkbox[twiDtChkType]').each(function () {
                if ($(this).prop('checked')) {
                    selections.push($(this).parent().parent('tr').data('rowData'));
                }
            });
        }
        else {
            //单项没有checkbox列，则通过样式选择
            $('#' + this.id).children('tbody').children('.twiSelected').each(function (index) {
                selections.push($(this).data('rowData'));
            });
        }
        return selections;
    }

    /**
     * 获取最后选择行索引【仅限单选模式有效,多选请使用getSelectionsIndex()】
     * 【1.2.1+】
     */
    Twi.DataTable.prototype.getLastSelectedIndex = function () {
        var selections = this.getSelectionsIndex();
        if (selections.length > 0) {
            return selections[0]
        }
        return -1;
    }

    /**
     *  获取选择的集合的索引 【1.2.1+】
     */
    Twi.DataTable.prototype.getSelectionsIndex = function () {
        var selections = [];
        //有选择框列的情况
        if (this.config._showCheckBox) {
            $('#' + this.id).children('tbody').find(':checkbox[twiDtChkType]').each(function () {
                if ($(this).prop('checked')) {
                    selections.push(parseInt($(this).parent().parent('tr').data('rowIndex')));
                }
            });
        }
        else {
            //单项没有checkbox列，则通过样式选择
            $('#' + this.id).children('tbody').children('.twiSelected').each(function (index) {
                selections.push(parseInt($(this).data('rowIndex')));
            });
        }
        return selections;
    }

    /**
     * 选择所有行
     */
    Twi.DataTable.prototype.selectAll = function () {
        if (this.config._showCheckBox) {
            $('#' + this.id).find(':checkbox[twiDtChkType]').prop('checked', true);
        }
    }

    /**
     * 取消选择所有行
     */
    Twi.DataTable.prototype.unSelectAll = function () {
        if (this.config._showCheckBox) {
            $('#' + this.id).find(':checkbox[twiDtChkType]').prop('checked', false);
        }
    }

    /**
     * 根据键值对选中行【可能会选中多行】
     */
    Twi.DataTable.prototype.checkedByKeyValue = function (key, value) {
        var me = this;
        for (var i = 0; i < me._data.length; i++) {
            if (me._data[i][key] == value) {
                me.checkedByIndex(i);
            }
        }
    }

    /**
     * 根据idField的值选中行【如果idField未配置无效,由于默认idField唯一，所以只会选择第一个】
     *
     * @idFieldValue: idField对应行数据的值,
     *                     例如：rowData = {FCode:'001',FName:'xzh'},如果idField配置为FCode，则传001；
     *                     如果idField配置为FName，则传xzh。
     */
    Twi.DataTable.prototype.checkedById = function (idFieldValue) {
        var me = this;
        if (!me.config._showCheckBox || typeof me.config.idField != 'string') return;
        for (var i = 0; i < me._idFieldValues.length; i++) {
            if (me._idFieldValues[i] == idFieldValue) {
                me.checkedByIndex(i);
                break; //只会处理第一个
            }
        }
    }

    /**
     * 根据索引选中行
     */
    Twi.DataTable.prototype.checkedByIndex = function (index) {
        var me = this;
        if (!me.config.multiSelect) {
            me.unSelectAll(); //单选需取消之前的选择
        }
        if (me.config._showCheckBox) {
            $('#' + me.id).children('tbody').find(':checkbox[twiDtChkType]').eq(index).prop('checked', true);
        }
        else {
            //单选且无checkbox
            $('#' + me.id).children('tbody').children('tr').removeClass('twiSelected');
            $('#' + me.id).children('tbody').find('tr').eq(index).addClass('twiSelected');
        }
    }

    /**
     * 选择行向上移动 【1.2.1+】
     * @fn 可选的回调函数
     */
    Twi.DataTable.prototype.rowUp = function (fn) {
        var me = this;
        var sectionsIndex = me.getSelectionsIndex();
        if (sectionsIndex.length == 0 || sectionsIndex[0] < 1) {
            return; //没有选择任何项 或 选择第一项已经是最顶部，则不需要移动
        }
        for (var i = 0; i < sectionsIndex.length; i++) {
            var sltRowIndex = sectionsIndex[i];
            if (sltRowIndex > 0)  //-1或0 不需要移动了
            {
                var data = me._data;
                var dataFirst = data.slice(0, sltRowIndex - 1); //除去需要交换位置的两个元素的前部分元素
                var dataPrevious = data.slice(sltRowIndex - 1, sltRowIndex); //选择的前一个元素
                var dataSelection = data.slice(sltRowIndex, sltRowIndex + 1);
                var dataLast = data.slice(sltRowIndex + 1); ////除去需要交换位置的两个元素的后部分元素
                me._data = dataFirst.concat(dataSelection, dataPrevious, dataLast); //交换后的数据                              
            }
        }
        me.loadData(me._data);
        for (var i = 0; i < sectionsIndex.length; i++) {
            var sltRowIndex = sectionsIndex[i];
            if (sltRowIndex > 0) {
                sltRowIndex -= 1;  //移动后选中的位置会改变
            }
            me.checkedByIndex(sltRowIndex);
            if (me.config._showCheckBox) {
                $('#' + me.id).children('tbody').find('tr').eq(sltRowIndex).addClass('twiSelected');
            }
            if (i == sectionsIndex.length - 1 && typeof fn == "function") {
                fn(); //执行回调函数
            }
        }
    }

    /**
     * 选择行向下移动 【1.2.1+】
     * @fn 可选的回调函数
     */
    Twi.DataTable.prototype.rowDown = function (fn) {
        var me = this;
        var sectionsIndex = me.getSelectionsIndex();
        if (sectionsIndex.length == 0 || sectionsIndex[sectionsIndex.length - 1] == me._data.length - 1) {
            return; //没有选择任何项 或 选择最后一项已经是最底部，则不需要移动
        }
        for (var i = sectionsIndex.length - 1; i >= 0; i--) {
            var sltRowIndex = sectionsIndex[i];
            if (sltRowIndex >= 0 && sltRowIndex < me._data.length - 1)  //-1或len-1 不需要移动了
            {
                var data = me._data;
                var dataFirst = data.slice(0, sltRowIndex); //除去需要交换位置的两个元素的前部分元素
                var dataSelection = data.slice(sltRowIndex, sltRowIndex + 1);
                var dataNext = data.slice(sltRowIndex + 1, sltRowIndex + 2); //选择的后一个元素        
                var dataLast = data.slice(sltRowIndex + 2); //除去需要交换位置的两个元素的后部分元素
                me._data = dataFirst.concat(dataNext, dataSelection, dataLast); //交换后的数据
            }
        }
        me.loadData(me._data);
        for (var i = sectionsIndex.length - 1; i >= 0; i--) {
            var sltRowIndex = sectionsIndex[i];
            if (sltRowIndex < me._data.length - 1) {
                sltRowIndex += 1;  //移动后选中的位置会改变
            }
            me.checkedByIndex(sltRowIndex);
            if (me.config._showCheckBox) {
                $('#' + me.id).children('tbody').find('tr').eq(sltRowIndex).addClass('twiSelected');
            }
            if (i == sectionsIndex.length - 1 && typeof fn == "function") {
                fn(); //执行回调函数
            }
        }
    }

    /**
     * 选择行向上移动至最顶部（第一个元素的位置） 【1.2.1+】
     * @fn 可选的回调函数
     */
    Twi.DataTable.prototype.rowUpToFirst = function (fn) {
        var me = this;
        var sectionsIndex = me.getSelectionsIndex();
        if (sectionsIndex.length == 0 || sectionsIndex[0] < 1) {
            return; //没有选择任何项 或 选择第一项已经是最顶部，则不需要移动
        }
        for (var i = 0; i < sectionsIndex.length; i++) {
            var sltRowIndex = sectionsIndex[i];
            if (sltRowIndex > 0)  //-1或0 不需要移动了
            {
                var toIndex = sltRowIndex - sectionsIndex[0]; //移动后的位置（移至）
                var data = me._data;
                if (toIndex == 0) {
                    var dataFirst = data.slice(0, sltRowIndex); //除去选择元素的前部分元素
                    var dataSelection = data.slice(sltRowIndex, sltRowIndex + 1);
                    var dataLast = data.slice(sltRowIndex + 1); //除去选择的后部分元素
                    me._data = dataSelection.concat(dataFirst, dataLast); //交换后的数据
                }
                else {
                    //从sltRowIndex位置 移动到 toIndex位置 其中：sltRowIndex > toIndex                    
                    var dataFirst = data.slice(0, toIndex);
                    var dataToIndex = data.slice(toIndex, toIndex + 1);
                    var dataMiddle = data.slice(toIndex + 1, sltRowIndex);
                    var dataSelection = data.slice(sltRowIndex, sltRowIndex + 1);
                    var dataLast = data.slice(sltRowIndex + 1);
                    me._data = dataFirst.concat(dataSelection, dataMiddle, dataToIndex, dataLast); //交换后的数据
                }
            }
        }
        me.loadData(me._data);
        for (var i = 0; i < sectionsIndex.length; i++) {
            var sltRowIndex = sectionsIndex[i];
            sltRowIndex -= sectionsIndex[0];  //移动后选中的位置会改变            
            me.checkedByIndex(sltRowIndex);
            if (me.config._showCheckBox) {
                $('#' + me.id).children('tbody').find('tr').eq(sltRowIndex).addClass('twiSelected');
            }
            if (i == sectionsIndex.length - 1 && typeof fn == "function") {
                fn(); //执行回调函数
            }
        }
    }

    /**
     * 选择行向上移动至最底部（最后一个元素的位置） 【1.2.1+】
     * @fn 可选的回调函数
     */
    Twi.DataTable.prototype.rowDownToLast = function (fn) {
        var me = this;
        var sectionsIndex = me.getSelectionsIndex();
        if (sectionsIndex.length == 0 || sectionsIndex[sectionsIndex.length - 1] == me._data.length - 1) {
            return; //没有选择任何项 或 选择最后一项已经是最底部，则不需要移动
        }
        for (var i = sectionsIndex.length - 1; i >= 0; i--) {
            var sltRowIndex = sectionsIndex[i];
            if (sltRowIndex >= 0 && sltRowIndex < me._data.length - 1)  //-1或len-1 不需要移动了
            {
                var toIndex = sltRowIndex + ((me._data.length - 1) - sectionsIndex[sectionsIndex.length - 1]); //移动后的位置（移至）
                var data = me._data;
                if (toIndex == me._data.length - 1) {
                    var dataFirst = data.slice(0, sltRowIndex); //除去选择元素的前部分元素
                    var dataSelection = data.slice(sltRowIndex, sltRowIndex + 1);
                    var dataLast = data.slice(sltRowIndex + 1); //除去选择的后部分元素
                    me._data = dataFirst.concat(dataLast, dataSelection); //交换后的数据
                }
                else {
                    //从sltRowIndex位置 移动到 toIndex位置 其中：sltRowIndex < toIndex                    
                    var dataFirst = data.slice(0, sltRowIndex);
                    var dataSelection = data.slice(sltRowIndex, sltRowIndex + 1);
                    var dataMiddle = data.slice(sltRowIndex + 1, toIndex);
                    var dataToIndex = data.slice(toIndex, toIndex + 1);
                    var dataLast = data.slice(toIndex + 1);
                    me._data = dataFirst.concat(dataToIndex, dataMiddle, dataSelection, dataLast); //交换后的数据
                }
            }
        }
        me.loadData(me._data);
        for (var i = sectionsIndex.length - 1; i >= 0; i--) {
            var sltRowIndex = sectionsIndex[i];
            if (sltRowIndex < me._data.length - 1) {
                sltRowIndex += (me._data.length - 1) - sectionsIndex[sectionsIndex.length - 1];  //移动后选中的位置会改变
            }
            me.checkedByIndex(sltRowIndex);
            if (me.config._showCheckBox) {
                $('#' + me.id).children('tbody').find('tr').eq(sltRowIndex).addClass('twiSelected');
            }
            if (i == sectionsIndex.length - 1 && typeof fn == "function") {
                fn(); //执行回调函数
            }
        }
    }

    /**
     * 扩展添加预定义数据格式，列数据显示格式 columns.format【1.2.1+】
     * @formatName:格式名
     * @fn:处理函数(传入参数为value)
     */
    Twi.DataTable.prototype.addColFormat = function (formatName, fn) {
        if (typeof fn != 'function') return;
        var me = this;
        me._colFormat = me._colFormat instanceof Array ? me._colFormat : [];
        me._colFormat[formatName] = []; //如果有则，移除之前的
        me._colFormat[formatName].push(fn);
    }

    /**
     * 获取预定义数据格式  【1.2.1+】
     * @formatName:格式名，如bool
     */
    Twi.DataTable.prototype.getColFormat = function (formatName) {
        var me = this;
        me._colFormat = me._colFormat instanceof Array ? me._colFormat : [];
        if (typeof me._colFormat[formatName] != 'undefined') {
            return me._colFormat[formatName][0];
        }
        else if (formatName == "bool") {
            //√× 格式显示
            me.addColFormat(formatName, function (value) {
                if (typeof value == "string") {
                    if (value == "1") {
                        return '<span style="color:green;">√</span>';
                    }
                    else if (value == "0") {
                        return '×';
                    }
                    return value;
                }
                else if (typeof value == "boolean") {
                    return value ? '<span style="color:green;">√</span>' : '×';
                }
                return value;
            });
            return me._colFormat[formatName][0];
        } 
        else if (formatName == 'strong') {
            //加粗显示 2017-9-11 17:11:20+   【1.3.6+】
            me.addColFormat(formatName, function (value) {
                return '<strong>' + value + '</strong>'
            });
            return me._colFormat[formatName][0];
        }
        else if (formatName.indexOf('color#') == 0) {
            //自定义颜色显示 2017-9-11 17:11:20+    【1.3.6+】
            var color = formatName.substring(5);
            me.addColFormat(formatName, function (value) {
                return '<span style="color:' + color + ';">' + value + '</span>';
            });
            return me._colFormat[formatName][0];
        }
        else if (formatName.indexOf('scolor#') == 0) {
            //自定义颜色加粗显示 2017-9-11 17:11:20+    【1.3.6+】
            var color = formatName.substring(6);
            me.addColFormat(formatName, function (value) {
                return '<strong style="color:' + color + ';">' + value + '</strong>';
            });
            return me._colFormat[formatName][0];
        }
        else {
            return function (value) {
                return value;
            }
        }
    }

    /**
     * 添加事件
     */
    Twi.DataTable.prototype.addListener = function (eventName, fn) {
        if (typeof this._handlers[eventName] == 'undefined') {
            this._handlers[eventName] = [];
        }
        if (typeof fn == "function") {
            this._handlers[eventName].push(fn);
        }
    }
    Twi.DataTable.prototype.on = Twi.DataTable.prototype.addListener;

    /**
     * 移除事件
     */
    Twi.DataTable.prototype.removeListener = function (eventName) {
        if (this._handlers[eventName] instanceof Array) {
            this._handlers[eventName] = undefined;
        }
    }
    Twi.DataTable.prototype.un = Twi.DataTable.prototype.off = Twi.DataTable.prototype.removeListener;

    /**
     * 触发事件
     * @eventName: 事件名称
     * @args: 参数对象
     */
    Twi.DataTable.prototype.fireEvent = function (eventName, args) {
        args = args || {};
        if (this._handlers[eventName] instanceof Array) {
            var fns = this._handlers[eventName];
            for (var i = 0; i < fns.length; i++) {
                fns[i](args);
            }
        }
    }

})(window.jQuery);

