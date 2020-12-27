import ackeeTracker from 'ackee-tracker';

import { writable, derived } from "svelte/store";
import { beforeUpdate } from "svelte";



export const location = writable({
  current: Location || undefined,
  previous: Location || undefined,
});

export const routeHasChanged = derived(location, ($l) => {
  if (!$l.previous || !$l.current) return true;

  if ($l.previous.pathname !== $l.current.pathname) return true;

  return false;
});

export function useAckeeSapper(afterUpdate, server, opts = {}) {
  let currentInstance = ackeeTracker.create(server, opts)
  beforeUpdate(() => {
    if (typeof window !== "undefined") {
      location.update((l) => {
        return {
          previous: l.current,
          current: { ...window.location },
        };
      });
    }
  });
  afterUpdate(() => {
    console.log('DENTRO', $routeHasChanged)
    if ($routeHasChanged) {
		let path = window.location.pathname

	  	const attributes = ackeeTracker.attributes(opts.detailed)
		const url = new URL(path, location)

		currentInstance.record({
			...attributes,
			siteLocation: url.href
		}).stop
    }
  });
}

/*
* USE ACKEE FOR SPA SVELTE
*/
export default function useAckeeSvelte( afterPageLoad, server, opts = {}){
    let currentInstance = ackeeTracker.create(server, opts)
	
	afterPageLoad(page => {
  		
		let path = window.location.pathname

	  	const attributes = ackeeTracker.attributes(opts.detailed)
		const url = new URL(path, location)

		currentInstance.record({
			...attributes,
			siteLocation: url.href
		}).stop
	})
	
}
