/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';
import {PathUtil} from './path.util';

describe('PathUtil', () => {
    beforeEach(() => {
            TestBed.configureTestingModule({
            });
        }
    );

    it('should convert path with no imdex', () => {
        const parts = PathUtil.strPathToParts('/a/b/c/d/e');

        expect(parts.length).toEqual(5);
        expect(parts).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('should convert path with 1 index', () => {
        const parts = PathUtil.strPathToParts('/a/b[name=foo]/c/d/e');

        expect(parts.length).toEqual(5);
        expect(parts).toEqual(['a', 'b[name=foo]', 'c', 'd', 'e']);
    });

    it('should convert path with 1 index slash', () => {
        const parts = PathUtil.strPathToParts('/a/b[name=1/0]/c/d/e');

        expect(parts.length).toEqual(5);
        expect(parts).toEqual(['a', 'b[name=1/0]', 'c', 'd', 'e']);
    });

    it('should convert path with 2 indices', () => {
        const parts = PathUtil.strPathToParts('/a/b[name=foo]/c/d/e[idx=bar]');

        expect(parts.length).toEqual(5);
        expect(parts).toEqual(['a', 'b[name=foo]', 'c', 'd', 'e[idx=bar]']);
    });


    it('should handle empty path', () => {
        const [parentpath, relpath] = PathUtil.strPathToParentChild('/');

        expect(relpath).toEqual('');
        expect(parentpath).toEqual('/');
    });

    it('should convert path with 2 indices to parent and child', () => {
        const [parent, child] = PathUtil.strPathToParentChild('/a/b[name=foo]/c/d/e[idx=bar]');

        expect(parent).toEqual('/a/b[name=foo]/c/d');
        expect(child).toEqual('e[idx=bar]');
    });

    it('should convert single leaf', () => {
        const [parentpath, relpath] = PathUtil.strPathToParentChild('/a');

        expect(relpath).toEqual('a');
        expect(parentpath).toEqual('/');
    });

    it('should convert simple path', () => {
        const [parentpath, relpath] = PathUtil.strPathToParentChild('/a/b/c');

        expect(relpath).toEqual('c');
        expect(parentpath).toEqual('/a/b');
    });

    it('should convert indexed path last', () => {
        const [parentpath, relpath] = PathUtil.strPathToParentChild('/a/b[name=123]');

        expect(relpath).toEqual('b[name=123]');
        expect(parentpath).toEqual('/a');
    });

    it('should convert indexed path not last', () => {
        const [parentpath, relpath] = PathUtil.strPathToParentChild('/a/b[name=123]/d');

        expect(relpath).toEqual('d');
        expect(parentpath).toEqual('/a/b[name=123]');
    });

    it('should convert indexed path with slash in index last', () => {
        const [parentpath, relpath] = PathUtil.strPathToParentChild('/a/b[name=1/23]');

        expect(relpath).toEqual('b[name=1/23]');
        expect(parentpath).toEqual('/a');
    });

    it('should convert indexed path with slash in index not last', () => {
        const [parentpath, relpath] = PathUtil.strPathToParentChild('/a/b[name=1/23]/e');

        expect(relpath).toEqual('e');
        expect(parentpath).toEqual('/a/b[name=1/23]');
    });

    it('should convert double indexed path with slash in index not last', () => {
        const [parentpath, relpath] = PathUtil.strPathToParentChild('/a/b[name=1/23]/e/f[idx=x/y]/g');

        expect(relpath).toEqual('g');
        expect(parentpath).toEqual('/a/b[name=1/23]/e/f[idx=x/y]');
    });
});
