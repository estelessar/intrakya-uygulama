import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Comment, CommentReply } from '../../types';

interface CommentState {
  comments: Comment[];
  productComments: { [productId: string]: Comment[] };
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  productComments: {},
  loading: false,
  error: null,
};

// Async thunks
export const createComment = createAsyncThunk(
  'comments/create',
  async (commentData: {
    productId: string;
    content: string;
    rating?: number;
    images?: string[];
  }) => {
    // Simulate API call
    const newComment: Comment = {
      id: Date.now().toString(),
      productId: commentData.productId,
      userId: 'current-user-id', // Will come from auth state
      user: {
          id: 'current-user-id',
          fullName: 'Kullanıcı',
          name: 'Kullanıcı',
          email: 'user@example.com',
          phoneNumber: '+90 555 000 0000',
          profileImage: undefined,
          userType: 'buyer' as const,
          isVerified: false,
          addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      content: commentData.content,
      rating: commentData.rating,
      images: commentData.images || [],
      replies: [],
      isVerifiedPurchase: false, // Will be determined by API
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return newComment;
  }
);

export const createCommentReply = createAsyncThunk(
  'comments/createReply',
  async (replyData: {
    commentId: string;
    content: string;
    isSeller?: boolean;
  }) => {
    // Simulate API call
    const newReply: CommentReply = {
      id: Date.now().toString(),
      commentId: replyData.commentId,
      userId: 'current-user-id',
      user: {
          id: 'current-user-id',
          fullName: replyData.isSeller ? 'Satıcı' : 'Kullanıcı',
          name: replyData.isSeller ? 'Satıcı' : 'Kullanıcı',
          email: 'user@example.com',
          phoneNumber: '+90 555 000 0000',
          profileImage: undefined,
          userType: replyData.isSeller ? 'seller' as const : 'buyer' as const,
          isVerified: false,
          addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      content: replyData.content,
      isSeller: replyData.isSeller || false,
      createdAt: new Date(),
    };
    
    return { commentId: replyData.commentId, reply: newReply };
  }
);

export const fetchProductComments = createAsyncThunk(
  'comments/fetchProductComments',
  async (productId: string) => {
    // Simulate API call - return demo comments
    const demoComments: Comment[] = [
      {
        id: '1',
        productId,
        userId: 'user1',
        user: {
          id: 'user1',
          fullName: 'Ahmet Yılmaz',
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phoneNumber: '+90 555 123 4567',
          profileImage: undefined,
          userType: 'buyer' as const,
          isVerified: false,
          addresses: [],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        content: 'Ürün çok kaliteli, hızlı kargo. Tavsiye ederim.',
        rating: 5,
        images: [],
        replies: [
          {
            id: 'reply1',
            commentId: '1',
            userId: 'seller1',
            user: {
              id: 'seller1',
              fullName: 'Mağaza Sahibi',
              name: 'Mağaza Sahibi',
              email: 'seller@example.com',
              phoneNumber: '+90 555 987 6543',
              profileImage: undefined,
              userType: 'seller' as const,
          isVerified: true,
          addresses: [],
              createdAt: new Date('2024-01-10'),
              updatedAt: new Date('2024-01-10'),
            },
            content: 'Teşekkür ederiz! Memnuniyetiniz bizim için çok önemli.',
            isSeller: true,
            createdAt: new Date('2024-01-16'),
          }
        ],
        isVerifiedPurchase: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        productId,
        userId: 'user2',
        user: {
          id: 'user2',
          fullName: 'Fatma Demir',
          name: 'Fatma Demir',
          email: 'fatma@example.com',
          phoneNumber: '+90 555 456 7890',
          profileImage: undefined,
          userType: 'buyer' as const,
          isVerified: false,
          addresses: [],
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
        },
        content: 'Beklediğimden daha iyi. Kalite/fiyat dengesi mükemmel.',
        rating: 4,
        images: [],
        replies: [],
        isVerifiedPurchase: true,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      }
    ];
    
    return { productId, comments: demoComments };
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId: string) => {
    // Simulate API call
    return commentId;
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateComment: (state, action: PayloadAction<{ commentId: string; content: string }>) => {
      const { commentId, content } = action.payload;
      
      // Update in all arrays
      const updateInArray = (comments: Comment[]) => {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.content = content;
          comment.updatedAt = new Date();
        }
      };
      
      updateInArray(state.comments);
      Object.values(state.productComments).forEach(updateInArray);
    },
  },
  extraReducers: (builder) => {
    builder
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
        
        const productId = action.payload.productId;
        if (!state.productComments[productId]) {
          state.productComments[productId] = [];
        }
        state.productComments[productId].push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Yorum eklenirken hata oluştu';
      })
      
      // Create comment reply
      .addCase(createCommentReply.fulfilled, (state, action) => {
        const { commentId, reply } = action.payload;
        
        // Add reply to comment in all arrays
        const addReplyToComment = (comments: Comment[]) => {
          const comment = comments.find(c => c.id === commentId);
          if (comment) {
            comment.replies.push(reply);
            comment.updatedAt = new Date();
          }
        };
        
        addReplyToComment(state.comments);
        Object.values(state.productComments).forEach(addReplyToComment);
      })
      
      // Fetch product comments
      .addCase(fetchProductComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductComments.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, comments } = action.payload;
        state.productComments[productId] = comments;
      })
      .addCase(fetchProductComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Yorumlar yüklenirken hata oluştu';
      })
      
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        
        state.comments = state.comments.filter(c => c.id !== commentId);
        
        Object.keys(state.productComments).forEach(productId => {
          state.productComments[productId] = state.productComments[productId].filter(
            c => c.id !== commentId
          );
        });
      });
  },
});

export const { clearError, updateComment } = commentSlice.actions;
export default commentSlice.reducer;