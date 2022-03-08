import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { routes } from 'modules';

import './App.css';

export const App = () => (
  <BrowserRouter>
    <Switch>
      {routes.map(({name, ...rest }) => (
        <Route key={name} {...rest} />
      ))}
    </Switch>
  </BrowserRouter>
);
