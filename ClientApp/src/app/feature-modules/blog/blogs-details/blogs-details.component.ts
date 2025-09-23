import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../../../models/blog.model';
import { BlogService } from '../blog.servise'


@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogs-details.component.html',
  styleUrls: ['./blogs-details.component.css']
})
export class BlogsDetailsComponent implements OnInit {
  blog?: Blog;
  isLiked: boolean = false;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadBlog(id);
  }

  loadBlog(id: string) {
    this.blogService.getBlogById(id).subscribe({
      next: (data) => this.blog = data,
      error: (err) => console.error(err)
    });
  }

  toggleLike() {
    if (!this.blog) return;
    this.isLiked = !this.isLiked;

    this.blogService.likeBlog(this.blog._id).subscribe({
      next: () => this.loadBlog(this.blog!._id),
      error: (err) => console.error(err)
    });
  }
}