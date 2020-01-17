import 'babel-polyfill'

const Post = {
    author: async (parent, args, ctx, info) => {
        const author = parent.author;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection = db.collection("usuarios");

        const result = await collection.findOne({email: author});

        return result;
    }
}

export {Post as default}