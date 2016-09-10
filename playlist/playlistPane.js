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
        kb.sym('http://purl.org/ontology/pbo/core#Playlist'))) {
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
    var firstSlot = kb.any(subject, $rdf.sym('http://purl.org/ontology/pbo/core#playlist_slot'))
    var obj = kb.any(firstSlot, $rdf.sym('http://purl.org/ontology/pbo/core#playlist_item'))
    var index = kb.any(firstSlot, $rdf.sym('http://purl.org/ontology/olo/core#index'))

    var uri = obj.uri
    var video = isVideo(uri)

    var div = myDocument.createElement('div')
    var img
    if (video && video.youtube) {
      uri = uri.replace('watch?v=', 'embed/')
      div.setAttribute('class', 'imageView')
      img = myDocument.createElement('IFRAME')
      img.setAttribute('src', uri)
      img.setAttribute('width', 560)
      img.setAttribute('height', 315)
      img.setAttribute('frameborder', 0)
      img.setAttribute('style', 'max-width: 850px; max-height: 100%;')
      img.setAttribute('allowfullscreen', 'true')
    } else {
      div.setAttribute('class', 'imageView')
      img = myDocument.createElement('IMG')
      img.setAttribute('src', obj.value)
      img.setAttribute('style', 'max-height: 85vh;')
      img.onclick = function() { UI.outline.GotoSubject(  UI.store.sym ( subject.uri.split('#')[0] + '#' + nIndex), true, undefined, true, undefined ) }
    }

    if (index) {
      var sl = kb.statementsMatching(null, $rdf.sym('http://purl.org/ontology/olo/core#index'), null, $rdf.sym(subject.uri.split('#')[0]))
      var slots = []
      for (var i = 0; i < sl.length; i++) {
        if (sl[i]) {
          slots.push(parseInt(sl[i].object.value))
        }
      }

      index = parseInt(index.value)
      var titleDiv = myDocument.createElement('div')
      //var indexDiv = myDocument.createElement('span')
      var parent = kb.any(null, $rdf.sym('https://schema.org/significantLink'), subject) || $rdf.sym(subject.uri.split('#')[0])

      var indexDiv = link(text('Playlist : ' + index + ' / ' + sl.length), parent.uri)
      indexDiv.onclick = function() { UI.outline.GotoSubject( UI.store.sym (parent.uri), true, undefined, true, undefined ) }

      titleDiv.appendChild(indexDiv)

      var navDiv = myDocument.createElement('div')

      var pIndex = slots[(slots.indexOf(index) - 1 + slots.length) % slots.length]
      var nIndex = slots[(slots.indexOf(index) + 1 + slots.length) % slots.length]

      var prev = link(text('❮ Previous'), firstSlot.uri.split('#')[0] + '#' + pIndex)

      navDiv.appendChild(prev)

      var next = link(text('Next ❯'), firstSlot.uri.split('#')[0] + '#' + nIndex)
      next.setAttribute('style', 'float: right')

      navDiv.appendChild(next)
    }

    var tr = myDocument.createElement('TR') // why need tr?
    if (titleDiv) {
      tr.appendChild(titleDiv)
    }
    tr.appendChild(img)
    if (navDiv) {
      tr.appendChild(navDiv)
    }
    div.appendChild(tr)
    return div
  }
}

// ends
