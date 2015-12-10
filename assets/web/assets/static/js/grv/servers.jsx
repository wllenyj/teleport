/*
Copyright 2015 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
'use strict';

var ServersPage = React.createClass({
    getInitialState: function(){
        return {servers: []};
    },
    componentDidMount: function() {
        this.reload();
      setInterval(this.reload, this.props.pollInterval);
    },
    connect: function(srv){
        this.refs.server.value = srv;
        React.findDOMNode(this.refs.session).submit();
    },
    disconnect: function(srv){
    },
    reload: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                if(this.modalOpen == true) {
                    return
                }
                this.setState({servers: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div id="wrapper">
              <LeftNavBar current="servers"/>
              <div id="page-wrapper" className="gray-bg">
                <TopNavBar/>
                <PageHeader title="SSH Servers" icon="fa fa-hdd-o"/>
                <div className="wrapper wrapper-content">
                  <Box>
                    <ServersTable servers={this.state.servers}  onConnect={this.connect}/>
                  </Box>            
                </div>
                <PageFooter/>
              </div>
              <form ref="session" action={grv.path("sessions")} method="POST" style={{display: 'none'}}>
                <input name="server" type="text" ref="server"/>
              </form>
            </div>
        );
    }
});


var ServersTable = React.createClass({
  render: function() {
    var onConnect = this.props.onConnect
    var onDisconnect = this.props.onDisconnect
    var rows = this.props.servers.map(function (srv, index) {
      return (
        <ServerRow srv={srv} key={index} onConnect={onConnect} onDisconnect={onDisconnect}/>
      );
    });
    return (
<table className="table table-striped">
   <thead>
      <tr>
         <th></th>
         <th>Address</th>
      </tr>
   </thead>
   <tbody>
      {rows}
   </tbody>
</table>);
  }
});


var ServerRow = React.createClass({
  handleConnect: function(e) {
      e.preventDefault();
      this.props.onConnect(this.props.srv);
  },
  render: function() {
    return (
<tr>
   <td><a href="#" onClick={this.handleConnect}><i className="fa fa-tty text-navy"></i></a></td>
   <td><a href="#" onClick={this.handleConnect}>{this.props.srv.addr}</a></td>
</tr>
    );
  }
});

React.render(
  <ServersPage url={grv.path("api","servers")} pollInterval={2000}/>,
  document.body
);