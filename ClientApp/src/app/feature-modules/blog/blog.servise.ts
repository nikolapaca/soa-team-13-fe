import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../../models/blog.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = '/blogs';

  token: any;
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem("token") ? localStorage.getItem("token") : '';
  }

  getAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getBlogById(id: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  likeBlog(blogId: string): Observable<string> {
        var decodedToken = jwtDecode(this.token);
        var accountId = decodedToken['sub']!
        console.log(accountId);
    const body = { account_id: accountId };

    return this.http.post(
      `${this.apiUrl}/${blogId}/like`,
      body,
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    );
  }
}
