# spacetravelling

[![](https://github.com/maradelynie/ignite-3modulo-desafio/blob/master/video.png)](https://youtu.be/njfO-ekmdXk)

My first Next.Js project, it was a half day code session for the challenge on Ignite by Rocketseat.
A blog that use static pages generations, using Prismic API integrations.

### Prerequisites

First of all you will need NodeJs, a browser that can run V8 engine like Chrome and a packege manager like NPM (but I strongly recommend to use Yarn)

[Get Node Here](https://nodejs.org/en/)

[Get Yarn Here](https://yarnpkg.com/)

For to connect this template in a Prismic blog you will need to get the endpoint of your account.

[Create your account](https://prismic.io/)

With a project setted, got to project dashboard > settings > api & security.
The first info will be yout endpoint, save it for later.

### Installing

For to run in on your enviroment you will need 2 things;

1 - First clone this project, and with a terminal openned at the project folder run:

```
$ yarn or $ npm install
```

2 - Then create a .env.local file on the root folder, there you will need to set:

```
PRISMIC_API_ENDPOINT=<your api endpoint from prisma>
```

Done! Run:

```
$ yarn dev or $ npm run dev
```

The project will be started at localhost:3000

## Running the tests

This tests where done by the template provider (RocketSeat) as a score mesure.
To run run;

```
$ yarn test or $ npm run test
```

## Made With

- next.js
- sass modules
- Prismic
- typescript

- SSR
- SSG

## Authors

**Mara Oliveira**

## License

MIT
