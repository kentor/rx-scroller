var React = require('react');
require('react/addons');
var Router = require('react-router');

var Route = Router.Route;

var Index = require('./components/index');

Router.run((
  <Route name="app" path="/" handler={Index}>
  </Route>
), function(Handler) {
  React.render(<Handler />, document.body);
});
