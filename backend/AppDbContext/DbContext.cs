using backend.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace backend.AppDbContext
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Chat> Chats => Set<Chat>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<MessageImage> MessageImages => Set<MessageImage>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Advertisement> Advertisements => Set<Advertisement>();
        public DbSet<AdvertisementCategory> AdvertisementCategories => Set<AdvertisementCategory>();
        public DbSet<AdvertisementImage> AdvertisementImages => Set<AdvertisementImage>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<UserRating> UserRatings => Set<UserRating>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                // User -> Role (1:N)
                entity.HasOne(u => u.Role)
                    .WithMany(r => r.Users)
                    .HasForeignKey(u => u.RoleId);

                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();

                entity.Property(u => u.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            modelBuilder.Entity<Advertisement>(entity =>
            {
                // User -> Advertisement (1:N)
                entity.HasOne(a => a.Owner)
                    .WithMany(u => u.Advertisements)
                    .HasForeignKey(a => a.OwnerId);

                entity.HasIndex(a => a.OwnerId);

                entity.HasQueryFilter(a => !a.IsDeleted);

                entity.Property(a => a.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });


            modelBuilder.Entity<Notification>(entity =>
            {
                // User -> Notifications (1:N)
                entity.HasOne(n => n.User)
                    .WithMany(u => u.Notifications)
                    .HasForeignKey(n => n.UserId);

                entity.Property(n => n.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            modelBuilder.Entity<Chat>(entity =>
            {
                // User -> Chat (UserFromId) (1:N)
                entity.HasOne(c => c.UserFrom)
                    .WithMany(u => u.ChatsFrom)
                    .HasForeignKey(c => c.UserFromId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(c => c.UserFromId);

                // User -> Chat (UserToId) (1:N)
                entity.HasOne(c => c.UserTo)
                    .WithMany(u => u.ChatsTo)
                    .HasForeignKey(c => c.UserToId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(c => c.UserToId);

                // Advertisement -> Chat (1:N)
                entity.HasOne(c => c.Advertisement)
                    .WithMany(a => a.Chats)
                    .HasForeignKey(r => r.AdvertisementId);

                entity.Property(c => c.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            modelBuilder.Entity<Message>(entity =>
            {
                // User -> Message (1:N)
                entity.HasOne(m => m.Sender)
                    .WithMany(u => u.Messages)
                    .HasForeignKey(m => m.SenderId);

                // Chat -> Message (1:N)
                entity.HasOne(m => m.Chat)
                    .WithMany(c => c.Messages)
                    .HasForeignKey(m => m.ChatId);

                entity.HasIndex(m => m.SenderId);
                entity.HasIndex(m => m.ChatId);

                entity.Property(m => m.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });


            modelBuilder.Entity<UserRating>(entity =>
            {
                // User -> UserRating (1:1)
                entity.HasOne(ur => ur.User)
                    .WithOne(u => u.Rating)
                    .HasForeignKey<UserRating>(ur => ur.UserId);

                entity.HasIndex(ur => ur.UserId).IsUnique();
            });

            modelBuilder.Entity<Review>(entity =>
            {
                // User -> Review (AuthorId) (1:N)
                entity.HasOne(r => r.Author)
                    .WithMany(u => u.Authors)
                    .HasForeignKey(r => r.AuthorId);

                // User -> Review (TargetUserId) (1:N)
                entity.HasOne(r => r.TargetUser)
                    .WithMany(u => u.TargetUsers)
                    .HasForeignKey(r => r.TargetUserId);

                entity.HasIndex(r => r.AuthorId);
                entity.HasIndex(r => r.TargetUserId);
                entity.HasIndex(r => new { r.AuthorId, r.AdvertisementId });

                entity.Property(r => r.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            modelBuilder.Entity<AdvertisementCategory>(entity =>
            {
                // Advertisement -> AdvertisementCategory (1:N)
                entity.HasOne(ac => ac.Advertisement)
                    .WithMany(a => a.AdvertisementCategories)
                    .HasForeignKey(ac => ac.AdvertisementId);

                // Category -> AdvertisementCategory (1:N)
                entity.HasOne(ac => ac.Category)
                    .WithMany(c => c.AdvertisementCategories)
                    .HasForeignKey(ac => ac.CategoryId);

                entity.HasIndex(ac => new { ac.AdvertisementId, ac.CategoryId })
                    .IsUnique();

                entity.Property(ac => ac.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            modelBuilder.Entity<AdvertisementImage>(entity =>
            {
                // Advertisement -> AdvertisementImage (1:N)
                entity.HasOne(ai => ai.Advertisement)
                    .WithMany(a => a.AdvertisementImages)
                    .HasForeignKey(ai => ai.AdvertisementId);

                entity.Property(ai => ai.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });

            modelBuilder.Entity<MessageImage>(entity =>
            {
                // Message -> MessageImage (1:N)
                entity.HasOne(mi => mi.Message)
                    .WithMany(m => m.Images)
                    .HasForeignKey(mi => mi.MessageId);

                entity.Property(mi => mi.CreatedAt)
                    .HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });
        }
    }
}
