import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Map, Marker, Polygon as LeafletPolygon } from 'leaflet';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.js';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import '../../../../lib/leaflet-easybutton/src/easy-button';
import { Polygon } from '../../../model/MapAreas/Polygons/Polygon';
import { UniversalPoint } from '../../../model/MapAreas/UniversalPoint';
import { AreaType } from '../../../model/type/AreaType';
import { MapService } from '../../../services/map.service';
import { PolygonService } from '../../../services/polygon.service';
import { StoreService } from '../../../services/store.service';
import { AreaTypeService } from '../../../services/type/area-type.service';

const markerIcon = L.icon({
  iconUrl: '/assets/icons/position.png',
  iconSize: [36, 36],
  iconAnchor: [36 / 2, 36 / 2],
});

@Component({
  selector: 'app-polygons',
  templateUrl: './polygons.component.html',
  styleUrls: ['./polygons.component.css'],
})
export class PolygonsComponent implements OnInit {
  public mapLoaded: boolean = false;
  private mapSize: number = 800;
  private mapBounds = [[0, 0], [this.mapSize, this.mapSize]];
  public markers: Marker[] = [];
  public polygons: Polygon[];
  public areaTypes: AreaType[] = [];
  private selectedAreaType: AreaType;
  public selectedAreaTypeId: string = '';
  private polygon: LeafletPolygon;
  public editedPolygonId: string;
  private map: Map;
  private imageWidth: number;
  public polygonName: string;
  private mapResolution: number = 0.01; // TODO

  constructor(
    private mapService: MapService,
    private polygonService: PolygonService,
    private storeService: StoreService,
    private areaTypeService: AreaTypeService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.polygonService.getPolygons().subscribe(polygons => {
      this.polygons = polygons;
    });

    this.areaTypeService.getAll().subscribe(areaTypes => {
      this.areaTypes = areaTypes;
    });

    this.downloadMapImage().subscribe(async imageUrl => {
      this.mapLoaded = true;
      this.imageWidth = await this.getImageWidth(imageUrl);
      this.initMap(imageUrl);
    });
  }

  downloadMapImage(): Observable<string> {
    const mapId = this.storeService.mapID;
    const fromLocalStorage = localStorage.getItem(mapId);

    const observable: Observable<string> = fromLocalStorage
      ? of(fromLocalStorage)
      : this.mapService.getMap(mapId).pipe(tap(base64image => localStorage.setItem(mapId, base64image)));

    return observable.pipe(map(base64image => `data:image/jpg;base64,${base64image}`));
  }

  initMap(imageUrl: string): void {
    this.map = L.map('map', { crs: L.CRS.Simple });
    this.map.on('click', event => this.addMarker(event));
    this.map.fitBounds(this.mapBounds);
    this.map.setMaxBounds(this.mapBounds);
    L.imageOverlay(imageUrl, this.mapBounds).addTo(this.map);
    L.easyButton('fa-crosshairs', () => this.centerMap()).addTo(this.map);
    this.polygon = L.polygon([]).addTo(this.map);
  }

  async getImageWidth(imageUrl: string): Promise<number> {
    return new Promise(resolved => {
      const image = new Image();
      image.onload = () => resolved(image.width);
      image.src = imageUrl;
    });
  }

  centerMap(): void {
    this.map.setView([this.mapSize / 2, this.mapSize / 2], 0);
  }

  deleteMarker(event): void {
    event.relatedTarget.remove();
    this.markers = this.markers.filter(marker => marker !== event.relatedTarget);
    this.updatePolygon();
  }

  updatePolygon(): void {
    const points = this.markers.map(marker => marker._latlng);
    this.polygon.setLatLngs(points);
  }

  resetPolygon(): void {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    this.updatePolygon();
  }

  cancelEdit(): void {
    this.editedPolygonId = null;
    this.resetPolygon();
  }

  onAreaSelected(id: string): void {
    this.selectedAreaTypeId = id;
    this.selectedAreaType = this.areaTypes.find(area => area.id === id);
    this.polygon.setStyle({ color: this.selectedAreaType.color });
  }

  addMarker(event): void {
    let marker = L.marker(event.latlng, {
      draggable: true,
      icon: markerIcon,
      contextmenu: true,
      contextmenuItems: [{
        text: 'Usuń punkt',
        callback: event => this.deleteMarker(event),
      }],
    });

    marker.on('move', () => this.updatePolygon());
    marker.addTo(this.map);
    this.markers.push(marker);
    this.updatePolygon();
  }

  savePolygon(): void {
    if (!this.polygonName) {
      this.toast.error('Podaj nazwę obszaru!');
      return;
    }

    if (!this.selectedAreaType) {
      this.toast.error('Podaj typ obszaru!');
      return;
    }

    if (this.markers.length < 3) {
      this.toast.error('Podaj co najmniej 3 wierzchołki!');
      return;
    }

    const universalPoints: UniversalPoint[] = this.markers.map(marker => {
      return new UniversalPoint(
        this.getRealCoordinates(marker.getLatLng().lat),
        this.getRealCoordinates(marker.getLatLng().lng),
      );
    });

    const polygonToSave = new Polygon(this.polygonName, this.selectedAreaType, universalPoints);

    if (this.editedPolygonId) {
      polygonToSave.id = this.editedPolygonId;
    }

    this.polygonService.save(polygonToSave).subscribe(result => {
      this.polygons = [...this.polygons.filter(polygon => polygon.id !== result.id), result];
      this.toast.success('Obszar zapisany w bazie');
      this.resetPolygon();
      this.editedPolygonId = null;
    });
  }

  selectPolygon(polygon: Polygon) {
    this.resetPolygon();
    this.editedPolygonId = polygon.id;
    this.onAreaSelected(polygon.type.id);

    polygon.points.forEach(point => {
      this.addMarker({
        latlng: L.latLng(
          this.getMapCoordinates(point.x),
          this.getMapCoordinates(point.y),
        ),
      });
    });
  }

  getMapCoordinates(value) {
    return ((value) + (this.imageWidth * this.mapResolution) / 2) * (1 / this.mapResolution) * (this.mapSize / this.imageWidth);
  }

  getRealCoordinates(value) {
    return (value * this.mapResolution * (this.imageWidth / this.mapSize) - ((this.imageWidth * this.mapResolution) / 2));
  }
}
