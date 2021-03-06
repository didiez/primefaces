/**
 * PrimeFaces Chips Widget
 */
PrimeFaces.widget.Chips = PrimeFaces.widget.BaseWidget.extend({

    init: function(cfg) {
        this._super(cfg);

        this.input = $(this.jqId + '_input');
        this.hinput = $(this.jqId + '_hinput');
        this.itemContainer = this.jq.children('ul');
        this.inputContainer = this.itemContainer.children('.ui-chips-input-token');

        //pfs metadata
        this.input.data(PrimeFaces.CLIENT_ID_DATA, this.id);
        this.hinput.data(PrimeFaces.CLIENT_ID_DATA, this.id);
        
        this.bindEvents();
    },
    
    bindEvents: function() {
        var $this = this;
        
        this.itemContainer.hover(function() {
                $(this).addClass('ui-state-hover');
            },
            function() {
                $(this).removeClass('ui-state-hover');
            }
        ).click(function() {
            $this.input.focus();
        });
        
        
        this.input.on('focus.chips', function() {
            $this.itemContainer.addClass('ui-state-focus');
        }).on('blur.chips', function() {
            $this.itemContainer.removeClass('ui-state-focus');
        }).on('keydown.chips', function(e) {
            var value = $(this).val();

            switch(e.which) {
                //backspace
                case 8:
                    if(value.length === 0 && $this.hinput.children('option') && $this.hinput.children('option').length > 0) {
                        var lastOption = $this.hinput.children('option:last'),
                        index = lastOption.index();
                        
                        $($this.itemContainer.children('li.ui-chips-token').get(index)).remove();
                        lastOption.remove();
                    }
                break;

                //enter
                case 13:
                    if(value && value.trim().length && (!$this.cfg.max||$this.cfg.max > $this.hinput.children('option').length)) {
                        $this.addItem(value);
                    }     
                    e.preventDefault();
                break;

                default:
                    if($this.cfg.max && $this.cfg.max === $this.hinput.children('option').length) {
                        e.preventDefault();
                    }
                break;
            }
        });
        
        var closeSelector = '> li.ui-chips-token > .ui-chips-token-icon';
        this.itemContainer.off('click', closeSelector).on('click', closeSelector, null, function(event) {
            $this.removeItem(event, $(this).parent());
        });
    },
    
    addItem : function(value) {
        var itemDisplayMarkup = '<li class="ui-chips-token ui-state-active ui-corner-all">';
        itemDisplayMarkup += '<span class="ui-chips-token-icon ui-icon ui-icon-close" />';
        itemDisplayMarkup += '<span class="ui-autocomplete-token-label">' + value + '</span></li>';

        this.inputContainer.before(itemDisplayMarkup);
        this.input.val('').focus();

        this.hinput.append('<option value="' + value + '" selected="selected"></option>');
    },
    
    removeItem: function(event, item) {
        var itemIndex = this.itemContainer.children('li.ui-chips-token').index(item);

        //remove from options
        this.hinput.children('option').eq(itemIndex).remove();
        item.remove();
    }
    
});