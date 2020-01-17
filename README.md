# EXAMEN FINAL

## Install

```js
npm install
```

## Run

```js
npm start
```

## Requests

### Type Usuario

```
type Usuario {
        _id: ID!
        email: String!
        password: String!
        type: Int!
        token: ID
        posts: [Post!]
    }
```
+ _id: MongoDB auto-generated id.
+ email.
+ password.
+ type: si es un autor se pone a 1, si es un lector se pone a 0.
+ posts: list of the author's posts.
+ token: session ID

### Type Post

```
type Post {
        _id: ID!
        title: String!
        description: String!
        author: Usuario!
    }
```

+ _id: MongoDB auto-generated id.
+ name.
+ message.
+ author.



## Queries

### Get Posts

To get all posts we enter a valid email with its token.

```
getPosts(email: String!, token: ID!): [Post!]
```

### Get Authors Posts

To get an author's posts we enter its email and token.

```
getAuthorsPosts(email: String!, token: ID!, emailAuthor: String!): [Post!]
```

### Get One Post

To get one post we enter an email with its token and the post's id.

```
getOnePost(email: String!, token: ID!, _id: ID!): Post!
```


## Mutations

### Sign Up

To create a new user in the database we enter an email, a password and the type of user: 1 (author) 0 (lector)

```
signUp(email: String!, password: String!, type: Int!): Usuario!
```

### Log In

To log in we enter an email with its password.

```
login(email: String!, password: String!): Usuario!
```

### Log Out

To log out we enter an email with its token.

```
logout(email: String!, token: ID!): Usuario!
```

### Add Post

To create a new post we enter the author's email and token, the post's title, and its description.

```
addPost(email: String!, token: ID!, title: String!, description: String!): Post!
```

### Remove User

To remove a user, and all of its posts, we enter its email and token.

```
removeUser(email: String!, token: ID!): String!
```

### Remove Post

To remove a post we enter its authors email and token, and the post's id.

```
removePost(email: String!, token: ID!, _id: ID!): String!
```


## Subscriptions

### Sub Author

To subscribe to an author and get notifications when it creates a post we enter a valid email with its token and the author's (who we want to subscribe to) email.

```
subAuthor(email: String!, token: ID!, subEmail: String!): Post!
```



