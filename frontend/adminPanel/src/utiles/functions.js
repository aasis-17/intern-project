import { useMapEvents, useMap } from "react-leaflet"
  //start end
  function createButton(label, container) {
    const btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}

export const routingMap = () => {
const map = useMap()
const control = L.Routing.control({
    routeWhileDragging: true,
    show : false
}).addTo(map);

map.on('click', function(e) {
    const container = L.DomUtil.create('div'),
        startBtn = createButton('Start location', container),
        destBtn = createButton('End location', container);

    L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);

        L.DomEvent.on(startBtn, 'click', function() {
            control.spliceWaypoints(0, 1, e.latlng);
            map.closePopup();
        });
        L.DomEvent.on(destBtn, 'click', function() {
            control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
            map.closePopup();
        });
});
}

// }