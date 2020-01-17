const Subscription = {
    subAuthor: {
        subscribe: async(parent, args, ctx, info) => {
            const { email, token, subEmail } = args;
            const { client, pubsub } = ctx;

            const db = client.db("EXAMEN");
            const collection2 = db.collection("usuarios");

            if (!await collection2.findOne({ email, token })) {
                throw new Error(`Author must be logged in.`)
            }

            return pubsub.asyncIterator(subEmail);
        }
    }

};

export { Subscription as default }