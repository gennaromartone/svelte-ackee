<script>
import { writable } from 'svelte/store'
const pathname = writable( window.location.pathname)


const ackeeTracker = require('ackee-tracker');
let currentInstance;
export function useAckee(pathname, server, opts = {}){
    currentInstance = ackeeTracker.create(server, opts)

    pathname.subscribe( (currentInstance)=>{
        const attributes = ackeeTracker.attributes(opts.detailed)
		const url = new URL($pathname, location)

		currentInstance.record({
			...attributes,
			siteLocation: url.href
		}).stop
    })
}
</script>