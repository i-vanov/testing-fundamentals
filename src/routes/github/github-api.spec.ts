import { describe, it } from 'vitest';
import { GithubApi } from './github-api';

describe('github-api', () => {
    describe('should get a repository', () => {
        it('should return repository information', async({expect}) => {
            const api = new GithubApi(undefined);
            const response = await api.getRepository('mhevery', 'qwik');
            expect(response).toMatchSnapshot();
        });

        it.todo('should timeout after x seconds with timeout response', () => {})
    })
});