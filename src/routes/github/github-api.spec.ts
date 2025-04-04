import { describe, it, Mock, vi } from 'vitest';
import { delay, Fetch, GithubApi } from './github-api';
import { number } from 'valibot';
import { beforeEach } from 'vitest';

describe('github-api', () => {
    let fetchMock: Mock<Parameters<Fetch>, ReturnType<Fetch>>;
    let delayMock: Mock<[number], Promise<void>>;
    let api: GithubApi;
    beforeEach(() => {
        fetchMock = vi.fn<Parameters<Fetch>, ReturnType<Fetch>>(mockPromise);
        delayMock = vi.fn<[number], Promise<void>>(mockPromise);
        api = new GithubApi("TOKEN", fetchMock, delayMock);
    });
    describe('should get a repository', () => {
        it('should return repository information', async({expect}) => {
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
            // call the API with the mock function
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