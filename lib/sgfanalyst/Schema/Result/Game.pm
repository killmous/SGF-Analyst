use utf8;
package sgfanalyst::Schema::Result::Game;

# Created by DBIx::Class::Schema::Loader
# DO NOT MODIFY THE FIRST PART OF THIS FILE

=head1 NAME

sgfanalyst::Schema::Result::Game

=cut

use strict;
use warnings;

use Moose;
use MooseX::NonMoose;
use MooseX::MarkAsMethods autoclean => 1;
extends 'DBIx::Class::Core';

=head1 COMPONENTS LOADED

=over 4

=item * L<DBIx::Class::InflateColumn::DateTime>

=back

=cut

__PACKAGE__->load_components("InflateColumn::DateTime");

=head1 TABLE: C<games>

=cut

__PACKAGE__->table("games");

=head1 ACCESSORS

=head2 id

  data_type: 'integer'
  is_auto_increment: 1
  is_nullable: 0

=head2 data

  data_type: 'text'
  is_nullable: 1

=head2 sgf

  data_type: 'text'
  is_nullable: 1

=head2 title

  data_type: 'text'
  is_nullable: 1

=head2 players_black

  data_type: 'text'
  is_nullable: 1

=head2 players_white

  data_type: 'text'
  is_nullable: 1

=head2 rankings_black

  data_type: 'text'
  is_nullable: 1

=head2 rankings_white

  data_type: 'text'
  is_nullable: 1

=head2 size

  data_type: 'integer'
  is_nullable: 1

=head2 komi

  data_type: 'real'
  is_nullable: 1

=head2 handicap

  data_type: 'integer'
  is_nullable: 1

=head2 date

  data_type: 'date'
  is_nullable: 1

=head2 event

  data_type: 'text'
  is_nullable: 1

=head2 winner

  data_type: 'text'
  is_nullable: 1

=cut

__PACKAGE__->add_columns(
  "id",
  { data_type => "integer", is_auto_increment => 1, is_nullable => 0 },
  "data",
  { data_type => "text", is_nullable => 1 },
  "sgf",
  { data_type => "text", is_nullable => 1 },
  "title",
  { data_type => "text", is_nullable => 1 },
  "players_black",
  { data_type => "text", is_nullable => 1 },
  "players_white",
  { data_type => "text", is_nullable => 1 },
  "rankings_black",
  { data_type => "text", is_nullable => 1 },
  "rankings_white",
  { data_type => "text", is_nullable => 1 },
  "size",
  { data_type => "integer", is_nullable => 1 },
  "komi",
  { data_type => "real", is_nullable => 1 },
  "handicap",
  { data_type => "integer", is_nullable => 1 },
  "date",
  { data_type => "date", is_nullable => 1 },
  "event",
  { data_type => "text", is_nullable => 1 },
  "winner",
  { data_type => "text", is_nullable => 1 },
);

=head1 PRIMARY KEY

=over 4

=item * L</id>

=back

=cut

__PACKAGE__->set_primary_key("id");


# Created by DBIx::Class::Schema::Loader v0.07039 @ 2014-05-23 17:36:55
# DO NOT MODIFY THIS OR ANYTHING ABOVE! md5sum:IyNPxQtnoRPSeUQK+q/QQw


# You can replace this text with custom code or comments, and it will be preserved on regeneration
__PACKAGE__->meta->make_immutable;
1;
