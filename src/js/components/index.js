var React = require('react');
var Rx = require('rx');

var Index = React.createClass({
  getInitialState: function() {
    var shit = [];
    for (var i = 0; i < 100; i++) {
      shit.push(i);
    }
    return { shit: shit };
  },

  componentDidMount: function() {
    var node = this.getDOMNode();
    var s = node.querySelector('.scroll-content-container');
    var scrollbar = node.querySelector('.scrollbar');
    var scrollbarTrack = node.querySelector('.scrollbar-track');

    var scroll = Rx.Observable.fromEvent(s, 'scroll');

    // scrolling
    var subscription = scroll.subscribe(function(e) {
      var magicRatio = scrollbar.clientHeight / s.scrollHeight;
      var scrollTop = e.target.scrollTop;
      var scrollTrackHeight = scrollbar.clientHeight * magicRatio;

      scrollbarTrack.style.top = (scrollTop * magicRatio) + "px";
      scrollbarTrack.style.height = scrollTrackHeight + "px";
    });

    // drag scrolling
    var mouseup = Rx.Observable.fromEvent(document, 'mouseup');
    var mousemove = Rx.Observable.fromEvent(document, 'mousemove');
    var mousedown = Rx.Observable.fromEvent(scrollbarTrack, 'mousedown');
    var mousedrag = mousedown.flatMap(function(md) {
      // calculate offsets with mouse down
      var startY = md.offsetY;

      // calculate delta with mousemove until mouseup
      return mousemove.map(function(mm) {
        if (mm.preventDefault) {
          mm.preventDefault();
        } else {
          event.returnValue = false;
        }

        return {
          top: mm.clientY - startY,
        };
      }).takeUntil(mouseup);
    });
    mousedrag.subscribe(function(pos) {
      var magicRatio = scrollbar.clientHeight / s.scrollHeight;
      s.scrollTop = pos.top / magicRatio;
    });
  },

  render: function() {
    return (
      <div className="scroller">
        <div className="scrollbar">
          <div className="scrollbar-track"></div>
        </div>
        <div className="scroll-content-container">
          <div className="scroll-content">
            {this.state.shit.map(function(shit, i) {
              return <div key={i}>{shit}</div>;
            })}
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Index;
