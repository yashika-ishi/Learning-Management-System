import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserListDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isApproved: boolean;
}

export interface UserUpdateDto {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private readonly baseUrl = 'https://localhost:7234/api/user';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserListDto[]> {
    return this.http.get<UserListDto[]>(this.baseUrl);
  }

  getUser(id: number): Observable<UserListDto> {
    return this.http.get<UserListDto>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, payload: UserUpdateDto): Observable<UserListDto> {
    return this.http.put<UserListDto>(`${this.baseUrl}/${id}`, payload);
  }

  updateRole(userId: number, roleId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/role`, { userId, roleId });
  }

  updateApproval(userId: number, isApproved: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/approval`, { userId, isApproved });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

