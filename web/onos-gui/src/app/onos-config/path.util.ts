/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PathUtil is for decomposing paths in to parts
 *
 * Copied from the Go file https://github.com/onosproject/onos-config/blob/master/pkg/utils/gnmiPathUtils.go
 * and translated in to TypeScript
 */
export class PathUtil {

    static strPathToParentChild(path: string): [string, string] {
        const parts: string[] = this.strPathToParts(path);
        const lastNode = parts.pop();
        const parentPath = '/' + parts.join('/');
        return [parentPath, lastNode === undefined ? '' : lastNode];
    }

    static strPathToParts(path: string): string[] {
        const result: string[] = [];
        if (path.length > 0 && path[0] === '/') {
            path = path.slice(1);
        }
        while (path.length > 0) {
            const i = this.nextTokenIndex(path);
            let part = path.slice(0, i);
            const partsNs = part.split(':');
            if (partsNs.length === 2) {
                // We have to discard the namespace as gNMI doesn't handle it
                part = partsNs[1];
            }
            result.push(part);
            path = path.slice(i);
            if (path.length > 0 && path[0] === '/') {
                path = path.slice(1);
            }
        }
        return result;
    }

    // nextTokenIndex returns the end index of the first token.
    private static nextTokenIndex(path: string): number {
        let inBrackets: boolean = false;
        let escape: boolean = false;

        const letters = path.split('');
        let i = 0;
        for (const c of letters) {
            switch (c) {
                case '[':
                    inBrackets = true;
                    escape = false;
                    break;
                case ']':
                    if (!escape) {
                        inBrackets = false;
                    }
                    escape = false;
                    break;
                case '\\':
                    escape = !escape;
                    break;
                case '/':
                    if (!inBrackets && !escape) {
                        return i;
                    }
                    escape = false;
                    break;
                default:
                    escape = false;
            }
            i = i + 1;
        }
        return path.length;
    }
}
