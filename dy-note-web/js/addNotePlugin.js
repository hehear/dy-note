;(function(win) {
    function isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
    }

    win.AddNotePlugin = {}

    function create(docBase, docEditBase, title) {
        title = title || 'Add Note'
        docEditBase = docEditBase || docBase.replace(/\/blob\//, '/edit/')

        function editDoc(event, vm) {
            var docName = vm.route.file

            // if (docName) {
            //     var editLink = docEditBase + docName
            //     window.open(editLink)
            //     event.preventDefault()
            //     return false
            // } else {
            //     return true
            // }
            alert(1);
        }

        win.AddNotePlugin.editDoc = editDoc

        function generateHeader(title) {
            return header = [
                '<div style="overflow: auto">',
                '<p style="float: right"><a style="text-decoration: underline; cursor: pointer"',
                'onclick="AddNotePlugin.onClick(event)">',
                title,
                '</a></p>',
                '</div>'
            ].join('')
        }

        return function(hook, vm) {
            win.AddNotePlugin.onClick = function(event) {
                AddNotePlugin.editDoc(event, vm)
            }

            if (isFunction(title)) {

                hook.afterEach(function (html) {
                    return generateHeader(title(vm.route.file)) + html
                })
            } else {
                var header = generateHeader(title)

                hook.afterEach(function (html) {
                    return header + html
                })
            }


        }
    }

    win.AddNotePlugin.create = create
}) (window)