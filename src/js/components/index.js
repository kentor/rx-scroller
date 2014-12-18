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

    var magicRatio = scrollbar.scrollHeight / s.scrollHeight;

    var scrollTrackHeight = scrollbar.scrollHeight * magicRatio
    var scrollbarTrack = node.querySelector('.scrollbar-track');
    scrollbarTrack.style.height = scrollTrackHeight + "px";

    var scroll = Rx.Observable.fromEvent(s, 'scroll');

    var subscription = scroll.subscribe(function(e) {
      var scrollTop = e.target.scrollTop;
      scrollbarTrack.style.top = (scrollTop * magicRatio) + "px";
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
