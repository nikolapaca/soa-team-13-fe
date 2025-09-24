import { Component, AfterViewInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { KeyPoint } from '../../feature-modules/tour/model/keyPoint.model';
import 'leaflet-routing-machine';


  const DEFAULT_POS: KeyPoint = {
    name: 'Start',
    description: '',
    image: '',
    latitude: 45.2396,
    longitude: 19.8227
  };

@Component({
  selector: 'app-map',
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css'],
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;
  private marker: L.Marker | undefined;
  private routeLayer?: L.LayerGroup;
  private routing?: any;
  private _initialPosition: KeyPoint = DEFAULT_POS;

  @Output() distanceAndTime = new EventEmitter<{distance: number, time: number}>();
  @Output() pointSelected = new EventEmitter<{ lat: number; lng: number }>();
  @Input() points: KeyPoint[] = [];

  @Input() set initialPosition(v: KeyPoint | null | undefined) {
    this._initialPosition = v ?? DEFAULT_POS;

    if (this.map) {
      const ll: [number, number] = [this._initialPosition.latitude, this._initialPosition.longitude];
      this.map.setView(ll, 13);
      if (this.marker) this.marker.setLatLng(ll);
      else this.marker = L.marker(ll).addTo(this.map);
    }
  }
  constructor() {}

  ngAfterViewInit(): void {
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png'
    });
    L.Marker.prototype.options.icon = defaultIcon;

    this.initMap();
    this.drawRoute();
  }

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['points'] && this.map) {
      console.log("Tacke: ", this.points);
      this.drawRoute();
    }
  }

  private initMap(): void {
    const savedLat = localStorage.getItem('lat');
    const savedLng = localStorage.getItem('long');

    const initialCoords: L.LatLngTuple =
      savedLat && savedLng
        ? [parseFloat(savedLat), parseFloat(savedLng)]
        : [45.2396, 19.8227];

    this.map = L.map('map', {
      center: initialCoords,
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    this.routeLayer = L.layerGroup().addTo(this.map);

    if (savedLat && savedLng) {
      this.marker = L.marker(initialCoords).addTo(this.map);
    }

    //routing kontrola
     this.routing = (L as any).Routing.control({
      waypoints: [],
      router: (L as any).Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot'
      }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: { styles: [{ weight: 4, opacity: 0.9 }] },
      createMarker: (_i: number, _wp: any) => null
    }).addTo(this.map);

    this.calculateDistance();

    this.registerOnClick();
  }

  private registerOnClick(): void {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const coord = e.latlng;
      const { lat, lng } = coord;

      console.log(
        'Kliknuli ste na mapu na geografskoj širini: ' + lat + ' i dužini: ' + lng
      );

      this.pointSelected.emit({ lat, lng });

      localStorage.setItem('lat', lat.toString());
      localStorage.setItem('long', lng.toString());

      if (this.marker) {
        this.marker.setLatLng(coord);
      } else {
        this.marker = L.marker(coord).addTo(this.map);
      }
    });
  }

  private drawRoute(): void {
    if (!this.map || !this.routing) return;

    if (!this.routeLayer) this.routeLayer = L.layerGroup().addTo(this.map);
    this.routeLayer.clearLayers();
    this.points.forEach((p, i) => {
      L.marker([+p.latitude, +p.longitude])
        .bindTooltip(`${i + 1}. ${p.name}`, { direction: 'top', offset: L.point(0, -8) })
        .addTo(this.routeLayer!);
    });

    // prosledi ruting mašini (ovo “snapuje” na puteve)
    const wps = (this.points || []).map(p => L.latLng(+p.latitude, +p.longitude));
    if (wps.length >= 2) {
      this.routing.setWaypoints(wps);
      this.calculateDistance();
    } else {
      this.routing.setWaypoints([]); // nema rute
      if (wps.length === 1) this.map.setView(wps[0], 15);
    }
  }

  private calculateDistance(){
    this.routing.on('routesfound', (event: any) => {
      const route = event.routes[0];

      const distance = route.summary.totalDistance / 1000; // u kilometrima
      const time = route.summary.totalTime / 60; // u minutima
      console.log(`Dužina: ${distance.toFixed(2)} km`);
      console.log(`Vreme: ${time.toFixed(2)} minuta`);
      this.distanceAndTime.emit({ distance, time });

  });
  }
}
