<template>
  <div class="container mx-auto mt-6">
    <button class="float-right bg-green-600 p-3 rounded mb-4 mt-4" @click="add_modal_open = true;">Add new light</button>
    <div class="my-2 flex sm:flex-row flex-col ml-8">
        <div class="flex flex-row mb-1 sm:mb-0">
            <div class="relative">
                <select
                    class="appearance-none h-full border sm:rounded-r-none block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
                    v-model="room"
                >
                    <option value="all" selected>All</option>
                    <option v-for="room in distinct_rooms" :key="room" :value="room">
                        {{ room }}
                    </option>
                </select>
                <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table class="w-full p-4 leading-normal">
            <thead>
                <tr>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nickname</th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Color</th>
                <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/12">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="light in lights_shown" :key="light._id">
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ light.nickname }}</td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ light.room }}</td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <toggle-button :value="light.status" :labels="{checked: 'On', unchecked: 'Off'}" :sync="true" @change="changeStatus(light._id)"/>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <input type="color" v-model="light.color" @change="changeColor(light)" />
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-red-500 w-1/12 focus:outline-none">
                        <button @click="deleteLight(light._id)">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="20" viewBox="0 0 24 24" stroke="currentColor" class="mx-auto">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
    <div class="fixed z-10 inset-0 overflow-y-auto" v-if="add_modal_open">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span
        >&#8203;
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  Add a new light
                </h3>
                <div class="mt-2 w-full">
                  <form class="leading-5 text-gray-500 w-full">
                    <div class="mb-4">
                      <input
                        id="light_name"
                        v-model="light_nickname"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Light Nickname"
                      />
                    </div>
                    <div>
                      <input
                        id="ligt_room"
                        v-model="light_room"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Room"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                @click="addLight"
              >
                Add
              </button>
            </span>
            <span
              class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto"
            >
              <button
                type="button"
                class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                @click="add_modal_open = false;"
              >
                Cancel
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import io from 'socket.io-client';
import { ToggleButton } from 'vue-js-toggle-button'
const API_DOMAIN = 'http://localhost:3000';

export default {
    name: "App",

    components: {
        ToggleButton
    },

    data: () => ({
        lights: [],
        light_nickname: '',
        light_room: '',
        add_modal_open: false,
        socket: null,
        room: 'all',
    }),
    computed: {
        lights_shown: function() {
            if (this.room !== 'all') {
                return this.lights.filter(element => element.room === this.room);
            } else {
                return this.lights;
            }
        },
        distinct_rooms: function() {
            return [ ...new Set(this.lights.map(x => x.room)) ];
        }
    },
    mounted() {
        axios.get(`${API_DOMAIN}/api/light`).then((res) => {
            this.lights = res.data;
            this.socket = io(`${API_DOMAIN}`, { transports: [ 'websocket' ] });
            this.socket.on('stc light change status', (msg) => {
                const light = this.lights.find(element => element._id === msg.light_id);
                light.status = msg.status;
            });
            this.socket.on('stc light change color', (msg) => {
                const light = this.lights.find(element => element._id === msg.light_id);
                light.color = msg.color;
            });
            this.socket.on('stc light delete', (msg) => {
                this.lights = this.lights.filter(element => element._id !== msg.light_id);
            });
            this.socket.on('stc light connect', (msg) => {
                this.lights.push(msg);
            });
        });
    },
    methods: {
        addLight: function () {
            axios.post(`${API_DOMAIN}/api/light`, {
                nickname: this.light_nickname,
                room: this.light_room
            }).then(() => {
                this.light_nickname = '';
                this.light_room = '';
                this.add_modal_open = false;
            });
        },
        changeColor: function(light) {
            this.socket.emit('cts change light color', { light_id: light._id, color: light.color });
        },
        changeStatus: function (light_id) {
            const light = this.lights.find(element => element._id === light_id);
            light.status = !light.status;
            this.socket.emit('cts change light status', { light_id: light_id, status: light.status });
        },
        deleteLight: function(light_id) {
            this.socket.emit('cts delete light', { light_id });
        }
    }
};
</script>

<style scoped>
.toggle__button {
    vertical-align: middle;
    user-select: none;
    cursor: pointer;
}
.toggle__button input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    width: 1px;
    height: 1px;
}
.toggle__button .toggle__switch {
    display:inline-block;
    height:12px;
    border-radius:6px;
    width:40px;
    background: #BFCBD9;
    box-shadow: inset 0 0 1px #BFCBD9;
    position:relative;
    margin-left: 10px;
    transition: all .25s;
}

.toggle__button .toggle__switch::after, 
.toggle__button .toggle__switch::before {
    content: "";
    position: absolute;
    display: block;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    left: 0;
    top: -3px;
    transform: translateX(0);
    transition: all .25s cubic-bezier(.5, -.6, .5, 1.6);
}

.toggle__button .toggle__switch::after {
    background: #4D4D4D;
    box-shadow: 0 0 1px #666;
}
.toggle__button .toggle__switch::before {
    background: #4D4D4D;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
    opacity:0;
}
</style>