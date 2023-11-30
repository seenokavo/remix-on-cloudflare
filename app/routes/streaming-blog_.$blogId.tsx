import {Await, useLoaderData} from '@remix-run/react';
// import {Suspense} from 'react';
// import FetchPostWithDelay from '~/components/streaming-blog/FetchPostWithDelay';
import type {LoaderFunctionArgs} from '@remix-run/node';
import {defer, json} from '@remix-run/node';
import {Suspense} from 'react';
import FetchPostWithDelay from '~/components/streaming-blog/FetchPostWithDelay';
import {returnStatement} from '@babel/types';

function delay(ms: number): Promise<void> {
    return new Promise((resolve, _) => {
        setTimeout(resolve, ms);
    });
}

export default function ArticlePage() {
    const {id, post} = useLoaderData<typeof loader>();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    This is a blog page for [{id}]
                </p>

                <Suspense fallback={<div>Loading</div>}>
                    <Await resolve={post}>
                        {(resolvedPost: Post) => <FetchPostWithDelay post={resolvedPost}/>}
                    </Await>
                </Suspense>

            </div>
        </main>
    );
}

export async function loader({params}: LoaderFunctionArgs) {
    const id = params.blogId || 'none';
    const post: Promise<Post> = FetchPost(id);
    return defer({id, post});
}

async function FetchPost(id: string) {
    await delay(3500);
    const post: Promise<Post> = fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(res => res.json());
    return post;
}