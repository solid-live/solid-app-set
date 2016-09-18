/*   Collection Pane
**
**  This pane allows collections of significant links to be viewed
*/
var UI = require('solid-ui')

module.exports = {
  icon: UI.icons.iconBase + 'noun_598334.svg',

  name: 'playlist',

  label: function (subject) {
    var kb = UI.store

    if (!kb.anyStatementMatching(
        subject, UI.ns.rdf('type'),
        kb.sym('https://schema.org/CollectionPage'))) {
      return null
    }

    return 'playlist'
  },

  render: function (subject, myDocument) {
    var link = function (contents, uri) {
      if (!uri) return contents
      var a = myDocument.createElement('a')
      a.setAttribute('href', uri)
      a.appendChild(contents)
      a.addEventListener('click', UI.widgets.openHrefInOutlineMode, true)
      return a
    }

    var text = function (str) {
      return myDocument.createTextNode(str)
    }

    var kb = UI.store
    var significantLinks = kb.statementsMatching(subject, $rdf.sym('https://schema.org/significantLink'))

    var containerDiv = myDocument.createElement('div')
    containerDiv.setAttribute('style', 'width : 100%; max-width: 1310px; margin: 0 auto; overflow: hidden; padding: 5px; text-align: center;')

    for (var i = 0; i < significantLinks.length; i++) {
      var l = significantLinks[i].object

      var linkDiv = myDocument.createElement('figure')
      linkDiv.setAttribute('style', 'float:left; width: 30%; word-wrap: break-word; position: relative; min-width: 150px; min-height: 150px; margin: 10px;')

      var title = kb.any(l, $rdf.sym('http://purl.org/dc/elements/1.1/title'))
      var thumbnail = kb.any(l, $rdf.sym('http://xmlns.com/foaf/0.1/thumbnail'))
      var displayText = title || i + '.' + l.uri

      if (thumbnail) {
        var thumb = myDocument.createElement('IMG')
        thumb.setAttribute('src', thumbnail.uri)

        var contentEl = myDocument.createElement('div')
        contentEl.setAttribute('style', 'height: 100%; box-shadow: -2px 2px 2px 1px #888; webkit-box-shadow: -2px 2px 2px 1px #888;')
        contentEl.appendChild(thumb)
        linkDiv.appendChild(contentEl)
        contentEl.href = l.uri
        contentEl.onclick = function () {
          var contentURI = this.href
          UI.outline.GotoSubject(UI.store.sym(contentURI), true, undefined, true, undefined)
          history.pushState({}, contentURI, contentURI)
        }

        var caption = link(text(displayText), l.uri)
        caption.innerHTML = displayText
        linkDiv.appendChild(caption)
      } else {
        contentEl = link(text(displayText), l.uri)
        linkDiv.appendChild(contentEl)
      }

      containerDiv.appendChild(linkDiv)
    }

    var tr = myDocument.createElement('TR') // why need tr?
    containerDiv.appendChild(tr)
    return containerDiv
  }
}

// ends
