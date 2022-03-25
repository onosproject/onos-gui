/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import {Pipe, PipeTransform} from '@angular/core';
import {ConfigLink} from './hierarchy-layout.service';

/**
 * A pipe used to filter out of the complete set of calculated links only the
 * ones useful to this layer.
 */

@Pipe({
    name: 'linkFilter',
    pure: false
})
export class LinkFilterPipe implements PipeTransform {

    transform(links: ConfigLink[], layerId: string): ConfigLink[] {
        if (links === undefined || links === null || links.length === 0) {
            return null;
        }
        const returnedLinks = Array<ConfigLink>(0);
        links.forEach((l) => {
            if (l.source.data.layerRefs.includes(layerId) && l.target.data.layerRefs.includes(layerId)) {
                returnedLinks.push(l);
            }
        });

        return returnedLinks;
    }
}
