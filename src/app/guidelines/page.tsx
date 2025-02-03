export default function Guidelines() {
    /* eslint-disable react/no-unescaped-entities */
    return (
        <div className="container mx-auto px-4 max-w-2xl py-8">

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">Read This First</h2>
                    <p className="text-gray-700">
                        Floored is a community by and for the dancefloors of New York City.
                    </p>
                    <p className="text-red-600">

                        This is a place for respectful, genuine interest; if you can't follow our guidelines, you'll get the boot.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Posting Info</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>If you include contact info in your post, everyone will see it. (not mandatory)</li>

                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Responses</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Respond if you think you're the person being sought.</li>
                        <li className="text-red-600">You can only respond once to a post. Include your contact info to continue the conversation outside this platform.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">The Beef Aisle</h2>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>If you have beef with another user, with us, or with the platform, contact us at <a href="mailto:theclubstack@gmail.com">theclubstack@gmail.com</a></li>

                    </ul>
                </section>

            </div>
        </div >
    );
}