package sgfanalyst::Controller::Analysis;
use Moose;
use namespace::autoclean;
use JSON;
use Data::Dumper;

BEGIN { extends 'Catalyst::Controller'; }

=head1 NAME

sgfanalyst::Controller::Analysis - Catalyst Controller

=head1 DESCRIPTION

Catalyst Controller.

=head1 METHODS

=cut


=head2 index

=cut

sub base :Chained('/') :PathPart('pages') :CaptureArgs(0) {
    my ( $self, $c ) = @_;

    $c->stash(db => $c->model('DB::Game'));
}

sub search :Chained('base') :PathPart('') :Args(0) {
    my ( $self, $c ) = @_;

    $c->stash(template => 'pages.tt');
}

sub analysis :Chained('base') :PathPart('') :Args(1) {
    my ( $self, $c, $id ) = @_;

    my $dbdata = $c->stash->{db}->find($id);
    if (!$dbdata) {
        $c->stash(template => '404.tt');
    } else {
        $c->stash(data => decode_json $dbdata->{_column_data}->{data});
        $c->stash(sgf => $dbdata->{_column_data}->{sgf});
        $c->stash(title => $dbdata->{_column_data}->{title});
        $c->stash(players => {
                black => $dbdata->{_column_data}->{players_black},
                white => $dbdata->{_column_data}->{players_white}
            });
        $c->stash(rankings => {
                black => $dbdata->{_column_data}->{rankings_black},
                white => $dbdata->{_column_data}->{rankings_white}
            });
        $c->stash(size => $dbdata->{_column_data}->{size});
        $c->stash(komi => $dbdata->{_column_data}->{komi});
        $c->stash(handicap => $dbdata->{_column_data}->{handicap});
        $c->stash(date => $dbdata->{_column_data}->{date});
        $c->stash(event => $dbdata->{_column_data}->{event});
        $c->stash(winner => $dbdata->{_column_data}->{winner});
        $c->stash(template => 'analysis.tt');
    }
}


=encoding utf8

=head1 AUTHOR

Wes Caldwell,,,

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;
