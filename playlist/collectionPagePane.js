/*   Playlist Pane
**
**  This pane allows playlists to be viewed
**  seeAlso: http://smiy.sourceforge.net/pbo/spec/playbackontology.html
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
    function isVideo (src, index) {
      if (!src) {
        return {
          html5: true
        }
      }

      var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-_%]+)/i)
      var vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i)
      var dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i)
      var vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i)

      if (youtube) {
        return {
          youtube: youtube
        }
      } else if (vimeo) {
        return {
          vimeo: vimeo
        }
      } else if (dailymotion) {
        return {
          dailymotion: dailymotion
        }
      } else if (vk) {
        return {
          vk: vk
        }
      }
    }

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
    var links = kb.statementsMatching(subject, $rdf.sym('https://schema.org/significantLink'))

    var containerDiv = myDocument.createElement('div')
    containerDiv.setAttribute('style', 'width : 100%; max-width: 1310px; margin: 0 auto; overflow: hidden; padding: 5px; text-align: center;')

    for (var i = 0; i < links.length; i++) {
      var l = links[i].object

      var linkDiv = myDocument.createElement('figure')
      var title = kb.any(l, $rdf.sym('http://purl.org/dc/elements/1.1/title'))
      var thumbnail = kb.any(l, $rdf.sym('http://xmlns.com/foaf/0.1/thumbnail'))
      var displayText = title || i + '.' + l.uri

      if (thumbnail) {
        var thumb = myDocument.createElement('IMG')
        thumb.setAttribute('src', thumbnail.uri)
        var contentEl = myDocument.createElement('div')
        contentEl.appendChild(thumb)
        var caption = link(text(displayText), l.uri)
        caption.innerHTML = displayText
        linkDiv.appendChild(caption)
      } else {
        var contentEl = link(text(displayText), l.uri)
      }
      contentEl.setAttribute('style', 'height: 100%; box-shadow: -2px 2px 2px 1px #888; webkit-box-shadow: -2px 2px 2px 1px #888;')

      linkDiv.setAttribute('style', 'float:left; width: 30%; word-wrap: break-word; position: relative; min-width: 150px; min-height: 150px; margin: 10px;')
      linkDiv.appendChild(contentEl)

      containerDiv.appendChild(linkDiv)
    }

    var tr = myDocument.createElement('TR') // why need tr?
    containerDiv.appendChild(tr)
    return containerDiv
  }
}

// ends
