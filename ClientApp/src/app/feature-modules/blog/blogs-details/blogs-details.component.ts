import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Blog } from '../../../models/blog.model';
import { BlogService } from '../blog.servise'
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule, ReactiveFormsModule],
  providers: [provideMarkdown()],
  templateUrl: './blogs-details.component.html',
  styleUrls: ['./blogs-details.component.css']
})
export class BlogsDetailsComponent implements OnInit {
  blog?: Blog;
  isLiked: boolean = false;
  newCommentText: string = '';

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

  submitComment() {
    if (!this.blog || this.newCommentText.trim() === '') return;
    console.log('Slanje komentara:', this.newCommentText);
    this.blogService.addComment(this.blog._id, this.newCommentText).subscribe({
        next: () => {
            console.log('Komentar uspešno poslat');
            this.newCommentText = ''; 
            this.loadBlog(this.blog!._id);
        },
        error: (err: any) => console.error('Greška pri slanju komentara:', err)
    });
  }
}