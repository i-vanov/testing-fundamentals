import { describe, it, vi } from 'vitest';
import { delay, Fetch, GithubApi } from './github-api';
import { number } from 'valibot';

describe('github-api', () => {
    describe('should get a repository', () => {
        it('should return repository information', async({expect}) => {
            // create a helper mocking function
            const fetchMock = vi.fn<Parameters<Fetch>, ReturnType<Fetch>>(mockPromise); //Setup
            // call the API with the mock function
            const api = new GithubApi("TOKEN", fetchMock, vi.fn(mockPromise) as any); //Setup

            const responsePromise = api.getRepository('USERNAME', 'REPOSITORY'); //Stimulus

            //Expects
            expect(fetchMock).toHaveBeenCalled();
            expect(fetchMock).toHaveBeenCalledWith(
             "https://api.github.com/repos/USERNAME/REPOSITORY",
                {headers: {
                    "User-Agent": "Qwik Workshop",
                    "X-GitHub-Api-Version": "2022-11-28",
                    Authorization: "Bearer TOKEN",
                },
                });
                fetchMock.mock.results[0].value.resolve(new Response('"RESPONSE"'))
                expect(await responsePromise).toEqual("RESPONSE");
        });

        it('should timeout after x seconds with timeout response', async ({expect}) => {
            const fetchMock = vi.fn<Parameters<Fetch>, ReturnType<Fetch>>(mockPromise); //Setup
            // call the API with the mock function
            const delayMock = vi.fn<[number], Promise<void>>(mockPromise);
            const api = new GithubApi("TOKEN", fetchMock, delayMock); //Setup
            const responsePromise = api.getRepository('USERNAME', 'REPOSITORY'); //Stimulus

            //Expects
            expect(fetchMock).toHaveBeenCalled();
            expect(fetchMock).toHaveBeenCalledWith(
             "https://api.github.com/repos/USERNAME/REPOSITORY",
                {headers: {
                    "User-Agent": "Qwik Workshop",
                    "X-GitHub-Api-Version": "2022-11-28",
                    Authorization: "Bearer TOKEN",
                },
                });
            expect(delayMock).toHaveBeenCalledWith(4000);
            delayMock.mock.results[0].value.resolve();
            expect(await responsePromise).toEqual({
                    response: "timeout",
                });
        });
        })
    });


function mockPromise<T>() {
    let resolve!: (value: T) => void;
    let reject!: (error: any) => void;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    }) as Promise<T> & { resolve: typeof resolve; reject: typeof reject };
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
}