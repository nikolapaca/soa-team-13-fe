import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Blog } from '../../models/blog.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:8070/blogs/';

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

  createBlog(blogData: FormData): Observable<any> {
    if (!this.token) {
        return throwError(() => ({ status: 401, message: 'Niste ulogovani.' }));
    }
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post(this.apiUrl, blogData, { headers: headers }); 
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

  addComment(blogId: string, text: string): Observable<any> {
    if (!this.token) {
        return throwError(() => ({ status: 401, message: 'Niste ulogovani.' }));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const commentData = {
      content: text,
    };
    
    return this.http.post(`${this.apiUrl}${blogId}/comments`, commentData, { headers });
}
}
