import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../blog.servise';
import { Blog } from '../../../models/blog.model';

@Component({
  selector: 'app-blogs-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blogs-list.component.html',
  styleUrls: ['./blogs-list.component.css']
})
export class BlogsListComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (data) => this.blogs = data,
      error: (err) => console.error(err)
    });
  }
}
