package sgfanalyst::Controller::Root;
use Moose;
use namespace::autoclean;
use Games::Go::SGF;
use JSON;

BEGIN { extends 'Catalyst::Controller' }

#
# Sets the actions in this controller to be registered with no prefix
# so they function identically to actions created in MyApp.pm
#
__PACKAGE__->config(namespace => '');

=encoding utf-8

=head1 NAME

sgfanalyst::Controller::Root - Root Controller for sgfanalyst

=head1 DESCRIPTION

[enter your description here]

=head1 METHODS

=head2 index

The root page (/)

=cut

sub index :Path :Args(0) {
    my ( $self, $c ) = @_;

    $c->stash(template => 'index.tt');
}

=head2 build

Build the sgf page

=cut

sub build :Chained('/') :PathPart('build') {
    my ( $self, $c ) = @_;

    if (exists $c->request->params->{data}) {
        my $file = $c->request->params->{data};

        my $sgf;
        eval {
            open(my $fh, '>', '/tmp/sgfanalyst') or die $c->log->info("This should never happen: $!");
            print $fh "$file\n";
            close $fh;
            $sgf = new Games::Go::SGF('/tmp/sgfanalyst');
        };
        if ($@) {
            $c->stash(error => "$@");
            $c->stash(template => 'index.tt');
        } else {
            $c->model('DB::Game')->create({
                        data => encode_json evaluate('/tmp/sgfanalyst'),
                        title => 'Go Analysis',
                        players_black => $sgf->black,
                        players_white => $sgf->white,
                        rankings_black => $sgf->BR,
                        rankings_white => $sgf->WR,
                        komi => $sgf->KM,
                        handicap => $sgf->HA,
                        date => $sgf->date,
                        event => $sgf->EV,
                        winner => $sgf->RE =~ /W/ ? 'White' : $sgf->RE =~ /B/ ? 'Black' : 'Jigo'});
            $c->response->body("Success!");
        }
    } else {
        $c->stash(template => 'index.tt');
    }
}

=head2 default

Standard 404 error page

=cut

sub default :Path {
    my ( $self, $c ) = @_;
    $c->response->body( 'Page not found' );
    $c->response->status(404);
}

=head2 evaluate

Simple evaluation subroutine

=cut

sub evaluate {
    my $arg = shift;

    my @ret;

    my $file;
    { local $/ = undef; local *FILE; open FILE, "<$arg" or die $!; $file = <FILE>; close FILE }

    my $nummoves = $file =~ s/;//g;
    print "Evaluating...";
    foreach my $i (1..$nummoves) {
        my $score = `gnugo --score estimate -l $arg -L $i`;
        push(@ret, {
            "color" => $score =~ m/^([A-Za-z]+)/g,
            "score" => $score =~ m/([0-9]+\.[0-9])/g
        });
    }
    print "\n";
    return \@ret;
}

=head2 end

Attempt to render a view, if needed.

=cut

sub end : ActionClass('RenderView') {}

=head1 AUTHOR

Wes Caldwell,,,

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

__PACKAGE__->meta->make_immutable;

1;