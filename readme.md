## Lightweight, headless CMS fromework for NodeJS

Inspired by strapi (https://strapi.io/) but want to be more lightweighted and mobile friendly, developer friendly.

- [x] Connect mysql database
- [x] Use knex to dynamicly create databases / tables
- [x] Better folder structure
- [x] Services, routes for DAPI (developer api, CRUD operations)
- [x] Basic auth process
- [x] Register routes for application developers
- [x] Policy management, config application router policy in router config file.
- [ ] Basic register process
- [ ] 3rd party auth (wechat)
- [ ] Basic developer dashboard frontend (View and modify data)
- [ ] Plugin system

## Global bared object

* bared.services - basic query services
  * `bared.services.get('post', { id: 1 })` Get post for ID = 1
  * `bared.services.getList('post', { _sort: 'created_at:desc' })` Get list with query, _limit, _start, _sort

* bared.knex - knex barednce
* bared.app - koa app barednce

## API category:

`/api` for public API, with no auth

`/papi` for private API, with auth

`/dapi` for developer, general CURD operations

## DAPI (Developer API endpoint):

Exposed by library out of box, need authorization and user auth_type=developer

`GET - /dapi/post/1` get post where id=1

`GET - /dapi/user` get list of users
  * `/dapi/user?_limit=2&_start=2` set limit and start
  * `/dapi/user?_sort=age:desc` sort
  * `/dapi/user?age~eq=21` select user age=21
  * `/dapi/user?age~gt=21` select user age>21, gte for >=
  * `/dapi/user?age~lt=21` select user age<21, lte for <=
  * `/dapi/user?id~in=[1,2,3]` select user id in [1,2,3], nin for not in

`GET - /dapi/user/count` count table, query same as get list

`POST - /dapi/comment` create a new comment item

`DELETE - /dapi/comment/1` delete comment where id=1

`PUT - /dapi/comment/1` update data for comment where id=1

