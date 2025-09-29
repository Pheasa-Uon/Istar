import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import {
    BranchModel,
    DropdownItemBranch,
    DropdownItemProvince
} from '../../../model/administrator/systemAdmin/branch.model';

@Injectable({ providedIn: 'root' })
export class BranchService {
    private apiUrl = environment.apiBase + environment.apiEndpoints.systemAdmin.branch;

    constructor(private http: HttpClient) {}

    // 🔹 Helper to build headers
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('authToken');
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    // ✅ Get all Branch
    getAllBranch(): Observable<BranchModel[]> {
        return this.http.get<BranchModel[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    // ✅ Get a single Branch
    getBranchById(id: number): Observable<BranchModel> {
        return this.http.get<BranchModel>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
    }

    // ✅ Create new Branch
    addBranch(country: BranchModel): Observable<BranchModel> {
        return this.http.post<BranchModel>(this.apiUrl, country, { headers: this.getAuthHeaders() });
    }

    // ✅ Update existing Branch
    updateBranch(country: BranchModel): Observable<BranchModel> {
        return this.http.put<BranchModel>(`${this.apiUrl}/${country.id}`, country, { headers: this.getAuthHeaders() });
    }

    // ✅ Delete Branch
    deleteBranch(countryId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${countryId}`, { headers: this.getAuthHeaders() });
    }

    // ✅ Search Branch
    searchBranch(keyword: string): Observable<BranchModel[]> {
        const url = `${this.apiUrl}/search?keyword=${encodeURIComponent(keyword)}`;
        return this.http.get<BranchModel[]>(url, { headers: this.getAuthHeaders() });
    }

    // ✅ Dropdowns
    getBranchDropdown(): Observable<DropdownItemBranch[]> {
        return this.http.get<DropdownItemBranch[]>(`${this.apiUrl}/branch-dropdown`, { headers: this.getAuthHeaders() });
    }

    getProvinceDropdown(): Observable<DropdownItemProvince[]> {
        return this.http.get<DropdownItemProvince[]>(`${this.apiUrl}/province-dropdown`, { headers: this.getAuthHeaders() });
    }
}
