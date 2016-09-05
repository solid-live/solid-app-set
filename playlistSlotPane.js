/*   Image Pane
**
**  This outline pane contains the document contents for an Image document
*/
var UI = require('solid-ui')

module.exports = {
  icon: UI.icons.originalIconBase + 'tango/22-image-x-generic.png',

  name: 'playlistSlot',

  label: function (subject) {
    var kb = UI.store
    var ns = UI.ns

    if (!kb.anyStatementMatching(
        subject, UI.ns.rdf('type'),
        kb.sym('http://purl.org/ontology/pbo/core#PlaylistSlot'))) // NB: Not dc: namespace!
      return null

    //   See aslo the source pane, which has lower precedence.

    var contentTypeMatch = function (kb, x, contentTypes) {
      var cts = kb.fetcher.getHeader(x, 'content-type')
      if (cts) {
        for (var j = 0; j < cts.length; j++) {
          for (var k = 0; k < contentTypes.length; k++) {
            if (cts[j].indexOf(contentTypes[k]) >= 0) {
              return true
            }
          }
        }
      }
      return false
    }

    var suppressed = [ 'application/pdf']
    if (contentTypeMatch(kb, subject, suppressed)) return null

    return 'playlist slot'
  },

  render: function (subject, myDocument) {
    function isVideo (src, index) {
      if (!src) {
        return {
          html5: true
        }
      }

      var youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i)
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
      console.log(myDocument)
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
    var obj = kb.any(subject, $rdf.sym('http://purl.org/ontology/pbo/core#playlist_item'))
    var index = kb.any(subject, $rdf.sym('http://purl.org/ontology/olo/core#index'))
    var sl = kb.statementsMatching(null,  $rdf.sym('http://purl.org/ontology/olo/core#index'))
    var slots = []
    for (var i = 0; i < sl.length; i++) {
      if (sl[i].object.value) {
        slots.push(parseInt(sl[i].object.value))
      }
    }
    console.log(slots)

    console.log(obj)
    var uri = obj.uri
    var video = isVideo(uri)

    if (video && video.youtube) {
      uri = uri.replace('watch?v=', 'embed/')
      var div = myDocument.createElement('div')
      div.setAttribute('class', 'imageView')
      var img = myDocument.createElement('IFRAME')
      img.setAttribute('src', uri) // w640 h480
      img.setAttribute('width', 560) // w640 h480
      img.setAttribute('height', 315) // w640 h480
      img.setAttribute('frameborder', 0) // w640 h480
      img.setAttribute('style', 'max-width: 850px; max-height: 100%;')
      img.setAttribute('allowfullscreen', 'true')
    } else {
      var div = myDocument.createElement('div')
      div.setAttribute('class', 'imageView')
      var img = myDocument.createElement('IMG')
      img.setAttribute('src', obj.value) // w640 h480
      img.setAttribute('width', 560) // w640 h480
      img.setAttribute('height', 315) // w640 h480
      img.setAttribute('style', 'max-width: 560; max-height: 315;')
    }

    if (index) {
      index = parseInt(index.value)
      var descDiv = myDocument.createElement('div')

      var pIndex = slots[(slots.indexOf(index) - 1 + slots.length ) % slots.length]
      var nIndex = slots[(slots.indexOf(index) + 1 + slots.length ) % slots.length]

      var prev = link(text('<<'), subject.uri.split('#')[0] + '#' + pIndex )

      descDiv.appendChild(prev)

      var indexDiv = myDocument.createElement('span')
      indexDiv.innerHTML = ' Playlist slot : ' + index + ' '

      descDiv.appendChild(indexDiv)

      var next = link(text('>>'), subject.uri.split('#')[0] + '#' + nIndex )
      descDiv.appendChild(next)
    }

    var tr = myDocument.createElement('TR') // why need tr?
    tr.appendChild(img)
    if (descDiv) {
      tr.appendChild(descDiv)
    }
    div.appendChild(tr)
    return div
  }
}

// ends
