# WMS Item Availability server

Small server to use for checking item availability at your institution.

Uses environment variables to set WSKey and institution id values. `WSKEY_PUBLIC`,
`WSKEY_SECRET` and `INST_ID` are required. `PORT` (default `8880`) and `BASE_URL`
(default `/`) aren't

## usage

    git clone https://github.com/malantonio/wms-item-availability-server
    cd wms-item-availability-server

and then

    WSKEY_PUBLIC="abc1234" WSKEY_SECRET="lalala" INST_ID="128807" npm start &> /dev/null

Or you could throw the whole thing into a bash script

    #!/usr/bin/env bash
    export WSKEY_PUBLIC="abc1234"
    export WSKEY_SECRET="lalala"
    export INST_ID="128807"

    $(which node) server

Then point your widget or whatever at `<server path>/oclc/<oclc number>` and get
item availability info as JSON back.

    {
      "oclcNumber": string, // oclc number passed
      "availableNow": bool, // boolean, true if _any_ holdings.circulations.availableNow is true, false otherwise
      "holdings": array     // array of holdings info
    }
