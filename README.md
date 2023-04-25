# Demo microfrontend Angular Multi-repository

This project is implemented to work as microfrontend components, using a multi-repository structure.

### Creating angular applications

```shell
ng new mf-shell --style=scss --routing=true
ng new mf-users --style=scss --routing=true
ng new mf-posts --style=scss --routing=true
```

This command will generate 3 angular applications that won't be part of the same workspace as the mono-repository structure.

### Add module federation library.

Add the angular's module federation library to each application that we created, **run the follow command on each project root**:

```shell
npm install -D @angular-architects/module-federation
```

Once installed the module federation library, we will create the webpack config for each project.

**Run this command on mf-shell**

```shell
ng add @angular-architects/module-federation --project=mf-shell --port=4200 --type=host
```

**Run this command on mf-users**

```shell
ng add @angular-architects/module-federation --project=mf-users --port=4201 --type=remote
```

**Run this command on mf-post**

```shell
ng add @angular-architects/module-federation --project=mf-posts --port=4202 --type=remote
```

### Configuring the webpack files

The next step is to configure all the webpack.config.js files for each project.
**On mf-users/webpack.config.js**

```javascript
module.exports = withModuleFederationPlugin({
  ...,
  exposes: {
    "./UsersModule": "./src/app/pages/users/users.module.ts",
  },
});
```

**On mf-users/webpack.config.js**

```javascript
module.exports = withModuleFederationPlugin({
  name: "mfUsers",
  exposes: {
    "./UsersModule": "./src/app/pages/users/users.module.ts",
  },
  ...,
});
```

**On mf-posts/webpack.config.js**

```javascript
module.exports = withModuleFederationPlugin({
  name: "mfPosts",
  exposes: {
    "./PostsModule": "./src/app/pages/posts/posts.module.ts",
  },
  ...,
});
```

**On mf-shell/webpack.config.js**

```javascript
module.exports = withModuleFederationPlugin({
  remotes: {
   mfUsers: "http://localhost:4201/remoteEntry.js",
   mfPosts: "http://localhost:4202/remoteEntry.js",
  },
  ...,
});
```

### Integrating microfrontends on shell

To integrate microfrontends we need to add the routes on the shell project aiming to the projects that we need to display.
**On mf-shell/src/app/app-routing.module.ts**

```js
...
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    //Users Project
    path: "",
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: "./UsersModule"
    }).then(m => m.UsersModule)
  }
];
```

Serve all the projects running

```shell
ng serve
```

### Error "caught SyntaxError: Cannot use 'import.meta' outside a module"

This error occurs because the shell app doesn't recognize where the assets are located.
That's why we need to configure the webpack.config.js to put the hosting where the assets are located for each project.
We need to store all the moduleFederationModule in a constant and configure it the public path.

**On mf-users/webpack.config.js**

```js
const moduleFederationConfig = withModuleFederationPlugin({
    ...,
});
//Set the mf-users host port
moduleFederationConfig.output.publicPath = "http:localhost:4201/";
module.exports = moduleFederationConfig;
```

**On mf-posts/webpack.config.js**

```js
const moduleFederationConfig = withModuleFederationPlugin({
    ...,
});
//Set the mf-posts host port
moduleFederationConfig.output.publicPath = "http:localhost:4202/";
module.exports = moduleFederationConfig;
```

**On mf-shell/webpack.config.js**

```js
const moduleFederationConfig = withModuleFederationPlugin({
    ...,
});
//Set the mf-shell host port
moduleFederationConfig.output.publicPath = "http:localhost:4200/";
module.exports = moduleFederationConfig;
```

### Making a communication between microfrontends

In contrast of a mono-repository structure where we can share data between microfrontends using a library on angular workspace, on multi-repository structure, we need to use some external dependencies.
For this practice we will use the package PubSubJS.

**On users and shell project run:**

```shell
  npm i pubsub-js
  npm i -D @types/pubsub-js
```

Add this line on tsconfig.json
```json
  "compilerOptions":{
    ...,
    "allowSyntheticDefaultImports":true
  }
```

- Implementation of PubSub in [mf-users](https://github.com/FernandoGM15/demo-microfrontend-multirepo/blob/main/mf-users/src/app/pages/users/user-card/user-card.component.ts#L21)

- Implementation of PubSub in [mf-shell](https://github.com/FernandoGM15/demo-microfrontend-multirepo/blob/main/mf-shell/src/app/app.component.ts#L19)