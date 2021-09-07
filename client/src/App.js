import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProjectPage from './ProjectPage';
import MainPage from './MainPage';

function App() {
  
  return (
    
  <Router>
    <Switch>
        <Route exact path="/" component={MainPage}>
        </Route>
        <Route path="/project/:id" component={ProjectPage}>
          <ProjectPage/>
        </Route>
    </Switch>
  </Router>

  );
}

export default App;