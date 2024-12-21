package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User implements UserDetails {
    @Id
    @Column(nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fullname", nullable = false)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "is_new")
    boolean isNew;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

   /* @OneToOne(mappedBy = "admin",fetch = FetchType.LAZY)
    private Shelter shelter;*/

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY) // Lazy fetch to avoid loading Shelter when not needed
    @JoinColumn(name = "shelter_id",nullable = true) // Name of the foreign key column
    private Shelter shelter;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println("Assigned authority: " + role.getName()); // Debugging log
        return List.of((GrantedAuthority) () ->role.getName()); // Return the role as a GrantedAuthority
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
