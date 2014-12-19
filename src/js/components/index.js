var React = require('react');
var Bacon = require('baconjs');
var ClassList = require('class-list');

var Index = React.createClass({
  getInitialState: function() {
    var shit = [];
    for (var i = 0; i < 10; i++) {
      shit.push(i);
    }
    return { shit: shit };
  },

  componentDidMount: function() {
    var node = this.getDOMNode();
    var viewport = node.querySelector('.scroll-content');
    var track = node.querySelector('.scrollbar-track');
    var thumb = node.querySelector('.scrollbar-thumb');

    function resizeAndRepositionThumb() {
      var magicRatio = track.clientHeight / viewport.scrollHeight;
      thumb.style.top = (viewport.scrollTop * magicRatio) + "px";
      thumb.style.height = (track.clientHeight * magicRatio) + "px";
    }

    var scroll = Bacon.fromEventTarget(viewport, 'scroll');
    var meViewport = Bacon.fromEventTarget(viewport, 'mouseenter');
    var meTrack = Bacon.fromEventTarget(track, 'mouseenter');
    var mlTrack = Bacon.fromEventTarget(track, 'mouseleave');

    // show
    var show = Bacon.once('start')
      .merge(scroll)
      .merge(meViewport)
      .merge(meTrack.map(true))
      .merge(mlTrack)
      .flatMapLatest(function(e) {
        if (e.target === track && e.type === 'mouseleave') {
          return Bacon.later(1000, false);
        }
        if ((e.target === viewport && e.type === 'mouseenter') ||
            e.type === 'scroll') {
          return Bacon.later(1000, false).startWith(true);
        }
        if (e === 'start') {
          return Bacon.later(2000, false).startWith(true);
        }
        return e;
      })
      .skipDuplicates();

    var cl = ClassList(thumb);
    show.onValue(function(bool) {
      if (bool) resizeAndRepositionThumb();
      cl[bool ? 'add' : 'remove']('visible');
    });

    // scrolling
    scroll.onValue(resizeAndRepositionThumb);

    // dragging
    var mouseup = Bacon.fromEventTarget(document, 'mouseup');
    var mousemove = Bacon.fromEventTarget(document, 'mousemove');
    var mousedown = Bacon.fromEventTarget(thumb, 'mousedown');
    mousedown.flatMap(function(md) {
      var startY = md.offsetY || md.layerY || 0;
      console.log('md.offsetY', startY);
      return mousemove.map(function(mm) {
        mm.preventDefault();
        console.log('mm.clientY', mm.clientY);
        return mm.clientY - startY;
      }).takeUntil(mouseup);
    }).onValue(function(top) {
      viewport.scrollTop = top * viewport.scrollHeight / track.clientHeight;
    });
  },

  render: function() {
    return (
      <div className="scroller">
        <div className="scrollbar-track">
          <div className="scrollbar-thumb"></div>
        </div>
        <div className="scroll-content">
          {this.state.shit.map(function(shit, i) {
            return <div key={i}>{shit}</div>;
          })}
        </div>
      </div>
    );
  },
});

module.exports = Index;
