const http = require('./http/request');

module.exports = class Netusb {
  constructor(URL) {
    this.URL = `${URL}/netusb`;
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0
     * }
     *
     * @param index
     * @returns {Promise<*>}
     */
  copyPlayQueue(index = '0') {
    return http.get(`${this.URL}/copyPlayQueue?index=${index}`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0,
     *  input: 'server',
     *  menu_layer: 0,
     *  max_line: 1,
     *  index: 0,
     *  playing_index: -1,
     *  menu_name: 'SERVER',
     *  list_info: [ {
     *      text: 'RT-N66U-E708',
     *      subtexts: [],
     *      thumbnail: '',
     *      attribute: 2
     *  } ]
     * }
     *
     * @param input
     * @param index
     * @param size (of list_info)
     * @returns {Promise<*>}
     */
  getListInfo(input = 'server', index = '0', size = '8') {
    return http.get(`${this.URL}/getListInfo?list_id=main&input=${input}&index=${index}&size=${size}&lang=en`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0,
     *  name_list: [
     *      'Playlist 1',
     *      'Playlist 2',
     *      'Playlist 3',
     *      'Playlist 4',
     *      'Playlist 5'
     *  ]
     * }
     *
     * @param bank ???
     * @param index ???
     * @returns {Promise<*>}
     */
  getMcPlaylistName(bank = '0', index = '0') {
    return http.get(`${this.URL}/getMcPlaylistName?bank=${bank}&index=${index}`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0,
     *  input: 'bluetooth',
     *  play_queue_type: 'system',
     *  playback: 'stop',
     *  repeat: 'off',
     *  shuffle: 'off',
     *  play_time: -60000,
     *  total_time: 0,
     *  artist: '',
     *  album: '',
     *  track: '',
     *  albumart_url: '',
     *  albumart_id: 4079,
     *  usb_devicetype: 'unknown',
     *  auto_stopped: false,
     *  attribute: 16777247,
     *  repeat_available: [ 'off', 'one', 'all' ],
     *  shuffle_available: [ 'off', 'on' ]
     * }
     *
     * @returns {Promise<*>}
     */
  getPlayInfo() {
    return http.get(`${this.URL}/getPlayInfo`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0,
     *  type: 'system',
     *  max_line: 0,
     *  playing_index: -1,
     *  index: 0,
     *  track_info: []
     * }
     *
     * @param index (negative or 8n, i.e. 0, 8, 16 etc.)
     * @returns {Promise<*>}
     */
  getPlayQueue(index = '0') {
    return http.get(`${this.URL}/getPlayQueue?index=${index}`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0,
     *  preset_info: [
     *      { input: 'net_radio', text: 'Radio Plus', attribute: 0 },
     *      { input: 'net_radio', text: 'Polskie Radio Jedynka', attribute: 0 }
     *      ...
     *      { input: 'unknown', text: '' }
     *  ],
     *  func_list: [ 'clear', 'move' ]
     * }
     *
     * @param band
     * @returns {Promise<*>}
     */
  getPresetInfo(band = 'common') {
    return http.get(`${this.URL}/getPresetInfo?band=${band}`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0,
     *  recent_info: [
     *      { input: 'server', text: 'Man Made Paradise', albumart_url: '', play_count: 1, attribute: 30 },
     *      { input: 'server', text: 'Mr. Bad Guy', albumart_url: '', play_count: 1, attribute: 30 },
     *      ...
     *      { input: 'server', text: 'Barcelona', albumart_url: '', play_count: 1, attribute: 30 }
     *  ]
     * }
     *
     * @returns {Promise<*>}
     */
  getRecentInfo() {
    return http.get(`${this.URL}/getRecentInfo`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0,
     *  services: [
     *      { input: 'net_radio', confirmed: true, use_service: true },
     *      { input: 'napster', confirmed: true, use_service: true },
     *      { input: 'spotify', confirmed: true, use_service: true },
     *      { input: 'juke', confirmed: true, use_service: true },
     *      { input: 'qobuz', confirmed: true, use_service: true },
     *      { input: 'tidal', confirmed: true, use_service: true },
     *      { input: 'deezer', confirmed: true, use_service: true }
     *  ]
     * }
     *
     * @returns {Promise<*>}
     */
  getStreamingServiceSettings() {
    return http.get(`${this.URL}/getStreamingServiceSettings`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0
     * }
     *
     * @param type (play_next | add_to_queue)
     * @param index
     * @returns {Promise<*>}
     */
  manageList(type = 'play_next', index = '0') {
    return http.get(`${this.URL}/manageList?list_id=main&type=${type}&index=${index}&timeout=60000&zone=main`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0
     * }
     *
     * @param type
     * @param index
     * @returns {Promise<*>}
     */
  managePlayQueue(type = 'remove', index = '0') {
    return http.get(`${this.URL}/managePlayQueue?type=${type}&index=${index}&zone=main`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0
     * }
     *
     * @param from
     * @param to
     * @returns {Promise<*>}
     */
  movePlayQueueItem(from, to) {
    return http.get(`${this.URL}/movePlayQueueItem?from=${from}&to=${to}`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0
     * }
     *
     * @param type ( select | play | return )
     * @param index
     * @returns {Promise<*>}
     */
  setListControl(type = 'select', index = '0') {
    return http.get(`${this.URL}/setListControl?type=${type}&index=${index}&zone=main`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0
     * }
     *
     * @param playback ( play | pause | next | previous )
     * @returns {Promise<*>}
     */
  setPlayback(playback = 'play') {
    return http.get(`${this.URL}/setPlayback?playback=${playback}`);
  }

  /**
     * Returns JSON object like this:
     * {
     *  response_code: 0
     * }
     *
     * @param bool ( use streaming services like NetRadio )
     * @returns {Promise<*>}
     */
  setStreamingServiceOption(bool = 'true') {
    return http.get(`${this.URL}/setStreamingServiceOption?use_service=${bool}`);
  }
};
